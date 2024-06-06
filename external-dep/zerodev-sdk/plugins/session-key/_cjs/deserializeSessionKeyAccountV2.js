"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeParamsFromInitCodeV2 = exports.deserializeSessionKeyAccountV2 = void 0;
const accounts_1 = require("@zerodev/sdk/accounts");
const accounts_2 = require("@zerodev/sdk/accounts");
const viem_1 = require("viem");
const accounts_3 = require("viem/accounts");
const toSessionKeyValidatorPlugin_js_1 = require("./toSessionKeyValidatorPlugin.js");
const utils_js_1 = require("./utils.js");
const deserializeSessionKeyAccountV2 = async (client, entryPointAddress, sessionKeyAccountParams, sessionKeySigner) => {
    const params = (0, utils_js_1.deserializeSessionKeyAccountParams)(sessionKeyAccountParams);
    let signer;
    if (params.privateKey)
        signer = (0, accounts_3.privateKeyToAccount)(params.privateKey);
    else if (sessionKeySigner)
        signer = sessionKeySigner;
    else
        throw new Error("No signer or serialized sessionKey provided");
    const sessionKeyPlugin = await (0, toSessionKeyValidatorPlugin_js_1.signerToSessionKeyValidator)(client, {
        signer,
        validatorData: params.sessionKeyParams,
        entryPoint: entryPointAddress
    });
    const { index, validatorInitData } = (0, exports.decodeParamsFromInitCodeV2)(params.accountParams.initCode);
    const kernelPluginManager = await (0, accounts_1.toKernelPluginManager)(client, {
        regular: sessionKeyPlugin,
        pluginEnableSignature: params.enableSignature,
        validatorInitData,
        action: params.action,
        kernelVersion: "0.0.2",
        entryPoint: entryPointAddress,
        ...params.validityData
    });
    return (0, accounts_2.createKernelV2Account)(client, {
        plugins: kernelPluginManager,
        index,
        deployedAccountAddress: params.accountParams.accountAddress,
        entryPoint: entryPointAddress
    });
};
exports.deserializeSessionKeyAccountV2 = deserializeSessionKeyAccountV2;
const decodeParamsFromInitCodeV2 = (initCode) => {
    let index;
    let validatorInitData;
    if (initCode === "0x")
        return { index, validatorInitData };
    const createAccountFunctionData = (0, viem_1.decodeFunctionData)({
        abi: accounts_2.KernelFactoryV2Abi,
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
exports.decodeParamsFromInitCodeV2 = decodeParamsFromInitCodeV2;
//# sourceMappingURL=deserializeSessionKeyAccountV2.js.map