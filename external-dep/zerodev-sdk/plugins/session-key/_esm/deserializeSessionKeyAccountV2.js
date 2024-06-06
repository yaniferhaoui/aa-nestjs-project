import { toKernelPluginManager } from "@zerodev/sdk/accounts";
import { KernelFactoryV2Abi, createKernelV2Account } from "@zerodev/sdk/accounts";
import { decodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { signerToSessionKeyValidator } from "./toSessionKeyValidatorPlugin.js";
import { deserializeSessionKeyAccountParams } from "./utils.js";
export const deserializeSessionKeyAccountV2 = async (client, entryPointAddress, sessionKeyAccountParams, sessionKeySigner) => {
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
    const { index, validatorInitData } = decodeParamsFromInitCodeV2(params.accountParams.initCode);
    const kernelPluginManager = await toKernelPluginManager(client, {
        regular: sessionKeyPlugin,
        pluginEnableSignature: params.enableSignature,
        validatorInitData,
        action: params.action,
        kernelVersion: "0.0.2",
        entryPoint: entryPointAddress,
        ...params.validityData
    });
    return createKernelV2Account(client, {
        plugins: kernelPluginManager,
        index,
        deployedAccountAddress: params.accountParams.accountAddress,
        entryPoint: entryPointAddress
    });
};
export const decodeParamsFromInitCodeV2 = (initCode) => {
    let index;
    let validatorInitData;
    if (initCode === "0x")
        return { index, validatorInitData };
    const createAccountFunctionData = decodeFunctionData({
        abi: KernelFactoryV2Abi,
        data: `0x${initCode.slice(42)}`
    });
    if (createAccountFunctionData.functionName === "createAccount") {
        index = createAccountFunctionData.args[2];
        validatorInitData = {
            validatorAddress: createAccountFunctionData.args[0],
            identifier: createAccountFunctionData.args[0],
            enableData: createAccountFunctionData.args[1]
        };
    }
    return { index, validatorInitData };
};
//# sourceMappingURL=deserializeSessionKeyAccountV2.js.map