import { KernelAccountAbi, createKernelAccount } from "@zerodev/sdk";
import { KernelFactoryAbi } from "@zerodev/sdk";
import { toKernelPluginManager } from "@zerodev/sdk/accounts";
import { decodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { toGasPolicy, toMerklePolicy, toSignaturePolicy, toSudoPolicy } from "./policies/index.js";
import { toECDSASigner } from "./signers/toECDSASigner.js";
import { createPermissionValidator } from "./toModularPermissionValidatorPlugin.js";
import { deserializeModularPermissionAccountParams } from "./utils.js";
export const deserializeModularPermissionAccount = async (client, entryPointAddress, modularPermissionAccountParams, modularSigner) => {
    const params = deserializeModularPermissionAccountParams(modularPermissionAccountParams);
    let signer;
    if (params.privateKey)
        signer = toECDSASigner({
            signer: privateKeyToAccount(params.privateKey)
        });
    else if (modularSigner)
        signer = modularSigner;
    else
        throw new Error("No signer or serialized sessionKey provided");
    const modularPermissionPlugin = await createPermissionValidator(client, {
        signer,
        policies: await Promise.all(params.modularPermissionParams.policies?.map((policy) => createPolicyFromParams(policy)) || []),
        validUntil: params.modularPermissionParams.validUntil || 0,
        validAfter: params.modularPermissionParams.validAfter || 0,
        entryPoint: entryPointAddress
    });
    const { index, validatorInitData } = decodeParamsFromInitCode(params.accountParams.initCode);
    const kernelPluginManager = await toKernelPluginManager(client, {
        regular: modularPermissionPlugin,
        pluginEnableSignature: params.enableSignature,
        validatorInitData,
        action: params.action,
        entryPoint: entryPointAddress,
        ...params.validityData
    });
    return createKernelAccount(client, {
        plugins: kernelPluginManager,
        index,
        deployedAccountAddress: params.accountParams.accountAddress,
        entryPoint: entryPointAddress
    });
};
export const createPolicyFromParams = async (policy) => {
    switch (policy.policyParams.type) {
        case "sudo":
            return await toSudoPolicy(policy.policyParams);
        case "signature":
            return await toSignaturePolicy(policy.policyParams);
        case "merkle":
            return await toMerklePolicy(policy.policyParams);
        case "gas":
            return await toGasPolicy(policy.policyParams);
        default:
            throw new Error("Unsupported policy type");
    }
};
export const decodeParamsFromInitCode = (initCode) => {
    let index;
    let validatorInitData;
    const createAccountFunctionData = decodeFunctionData({
        abi: KernelFactoryAbi,
        data: `0x${initCode.slice(42)}`
    });
    if (!createAccountFunctionData)
        throw new Error("Invalid initCode");
    if (createAccountFunctionData.functionName === "createAccount") {
        index = createAccountFunctionData.args[2];
        const initializeFunctionData = decodeFunctionData({
            abi: KernelAccountAbi,
            data: createAccountFunctionData.args[1]
        });
        if (!initializeFunctionData)
            throw new Error("Invalid initCode");
        if (initializeFunctionData.functionName === "initialize") {
            validatorInitData = {
                validatorAddress: initializeFunctionData.args[0],
                identifier: initializeFunctionData.args[0],
                enableData: initializeFunctionData.args[1]
            };
        }
    }
    if (index === undefined || validatorInitData === undefined)
        throw new Error("Invalid initCode");
    return { index, validatorInitData };
};
//# sourceMappingURL=deserializeModularPermissionAccount.js.map