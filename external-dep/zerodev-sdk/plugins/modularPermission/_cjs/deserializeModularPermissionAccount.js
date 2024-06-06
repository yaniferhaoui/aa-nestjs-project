"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeParamsFromInitCode = exports.createPolicyFromParams = exports.deserializeModularPermissionAccount = void 0;
const sdk_1 = require("@zerodev/sdk");
const sdk_2 = require("@zerodev/sdk");
const accounts_1 = require("@zerodev/sdk/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const index_js_1 = require("./policies/index.js");
const toECDSASigner_js_1 = require("./signers/toECDSASigner.js");
const toModularPermissionValidatorPlugin_js_1 = require("./toModularPermissionValidatorPlugin.js");
const utils_js_1 = require("./utils.js");
const deserializeModularPermissionAccount = async (client, entryPointAddress, modularPermissionAccountParams, modularSigner) => {
    const params = (0, utils_js_1.deserializeModularPermissionAccountParams)(modularPermissionAccountParams);
    let signer;
    if (params.privateKey)
        signer = (0, toECDSASigner_js_1.toECDSASigner)({
            signer: (0, accounts_2.privateKeyToAccount)(params.privateKey)
        });
    else if (modularSigner)
        signer = modularSigner;
    else
        throw new Error("No signer or serialized sessionKey provided");
    const modularPermissionPlugin = await (0, toModularPermissionValidatorPlugin_js_1.createPermissionValidator)(client, {
        signer,
        policies: await Promise.all(params.modularPermissionParams.policies?.map((policy) => (0, exports.createPolicyFromParams)(policy)) || []),
        validUntil: params.modularPermissionParams.validUntil || 0,
        validAfter: params.modularPermissionParams.validAfter || 0,
        entryPoint: entryPointAddress
    });
    const { index, validatorInitData } = (0, exports.decodeParamsFromInitCode)(params.accountParams.initCode);
    const kernelPluginManager = await (0, accounts_1.toKernelPluginManager)(client, {
        regular: modularPermissionPlugin,
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
exports.deserializeModularPermissionAccount = deserializeModularPermissionAccount;
const createPolicyFromParams = async (policy) => {
    switch (policy.policyParams.type) {
        case "sudo":
            return await (0, index_js_1.toSudoPolicy)(policy.policyParams);
        case "signature":
            return await (0, index_js_1.toSignaturePolicy)(policy.policyParams);
        case "merkle":
            return await (0, index_js_1.toMerklePolicy)(policy.policyParams);
        case "gas":
            return await (0, index_js_1.toGasPolicy)(policy.policyParams);
        default:
            throw new Error("Unsupported policy type");
    }
};
exports.createPolicyFromParams = createPolicyFromParams;
const decodeParamsFromInitCode = (initCode) => {
    let index;
    let validatorInitData;
    const createAccountFunctionData = (0, viem_1.decodeFunctionData)({
        abi: sdk_2.KernelFactoryAbi,
        data: `0x${initCode.slice(42)}`
    });
    if (!createAccountFunctionData)
        throw new Error("Invalid initCode");
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
    if (index === undefined || validatorInitData === undefined)
        throw new Error("Invalid initCode");
    return { index, validatorInitData };
};
exports.decodeParamsFromInitCode = decodeParamsFromInitCode;
//# sourceMappingURL=deserializeModularPermissionAccount.js.map