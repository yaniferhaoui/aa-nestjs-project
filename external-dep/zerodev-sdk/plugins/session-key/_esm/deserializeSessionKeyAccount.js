import { KernelAccountAbi, createKernelAccount } from "@zerodev/sdk";
import { KernelFactoryAbi } from "@zerodev/sdk";
import { toKernelPluginManager } from "@zerodev/sdk/accounts";
import { getEntryPointVersion } from "permissionless";
import { decodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { signerToSessionKeyValidator } from "./toSessionKeyValidatorPlugin.js";
import { deserializeSessionKeyAccountParams } from "./utils.js";
export const deserializeSessionKeyAccount = async (client, entryPointAddress, sessionKeyAccountParams, sessionKeySigner) => {
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const params = deserializeSessionKeyAccountParams(sessionKeyAccountParams);
    let signer;
    if (params.privateKey)
        signer = privateKeyToAccount(params.privateKey);
    else if (sessionKeySigner)
        signer = sessionKeySigner;
    else
        throw new Error("No signer or serialized sessionKey provided");
    const sessionKeyPlugin = await signerToSessionKeyValidator(client, {
        signer,
        validatorData: params.sessionKeyParams,
        entryPoint: entryPointAddress
    });
    const { index, validatorInitData } = decodeParamsFromInitCode(params.accountParams.initCode);
    const kernelPluginManager = await toKernelPluginManager(client, {
        regular: sessionKeyPlugin,
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
export const decodeParamsFromInitCode = (initCode) => {
    let index;
    let validatorInitData;
    if (initCode === "0x")
        return { index, validatorInitData };
    const createAccountFunctionData = decodeFunctionData({
        abi: KernelFactoryAbi,
        data: `0x${initCode.slice(42)}`
    });
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
    return { index, validatorInitData };
};
//# sourceMappingURL=deserializeSessionKeyAccount.js.map