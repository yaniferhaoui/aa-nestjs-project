"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeParamsFromInitCode = exports.deserializeSessionKeyAccount = void 0;
const sdk_1 = require("@zerodev/sdk");
const sdk_2 = require("@zerodev/sdk");
const accounts_1 = require("@zerodev/sdk/accounts");
const permissionless_1 = require("permissionless");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const toSessionKeyValidatorPlugin_js_1 = require("./toSessionKeyValidatorPlugin.js");
const utils_js_1 = require("./utils.js");
const deserializeSessionKeyAccount = async (client, entryPointAddress, sessionKeyAccountParams, sessionKeySigner) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const params = (0, utils_js_1.deserializeSessionKeyAccountParams)(sessionKeyAccountParams);
    let signer;
    if (params.privateKey)
        signer = (0, accounts_2.privateKeyToAccount)(params.privateKey);
    else if (sessionKeySigner)
        signer = sessionKeySigner;
    else
        throw new Error("No signer or serialized sessionKey provided");
    const sessionKeyPlugin = await (0, toSessionKeyValidatorPlugin_js_1.signerToSessionKeyValidator)(client, {
        signer,
        validatorData: params.sessionKeyParams,
        entryPoint: entryPointAddress
    });
    const { index, validatorInitData } = (0, exports.decodeParamsFromInitCode)(params.accountParams.initCode);
    const kernelPluginManager = await (0, accounts_1.toKernelPluginManager)(client, {
        regular: sessionKeyPlugin,
        pluginEnableSignature: params.enableSignature,
        validatorInitData,
        action: params.action,
        entryPoint: entryPointAddress,
        ...params.validityData
    });
    return (0, sdk_1.createKernelAccount)(client, {
        plugins: kernelPluginManager,
        index,
        deployedAccountAddress: params.accountParams.accountAddress,
        entryPoint: entryPointAddress
    });
};
exports.deserializeSessionKeyAccount = deserializeSessionKeyAccount;
const decodeParamsFromInitCode = (initCode) => {
    let index;
    let validatorInitData;
    if (initCode === "0x")
        return { index, validatorInitData };
    const createAccountFunctionData = (0, viem_1.decodeFunctionData)({
        abi: sdk_2.KernelFactoryAbi,
        data: `0x${initCode.slice(42)}`
    });
    if (createAccountFunctionData.functionName === "createAccount") {
        index = createAccountFunctionData.args[2];
        const initializeFunctionData = (0, viem_1.decodeFunctionData)({
            abi: sdk_1.KernelAccountAbi,
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
exports.decodeParamsFromInitCode = decodeParamsFromInitCode;
//# sourceMappingURL=deserializeSessionKeyAccount.js.map