"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKernelPluginManager = exports.isKernelPluginManager = void 0;
const permissionless_1 = require("permissionless");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const encodeModuleInstallCallData_js_1 = require("../../accounts/kernel/utils/account/ep0_6/encodeModuleInstallCallData.js");
const constants_js_1 = require("../../constants.js");
const kernel_js_1 = require("../../types/kernel.js");
const getKernelV3Nonce_js_1 = require("../kernel/utils/account/ep0_7/getKernelV3Nonce.js");
const accountMetadata_js_1 = require("../kernel/utils/common/accountMetadata.js");
const getActionSelector_js_1 = require("../kernel/utils/common/getActionSelector.js");
const getEncodedPluginsData_js_1 = require("../kernel/utils/plugins/ep0_6/getEncodedPluginsData.js");
const getPluginsEnableTypedData_js_1 = require("../kernel/utils/plugins/ep0_6/getPluginsEnableTypedData.js");
const getEncodedPluginsData_js_2 = require("../kernel/utils/plugins/ep0_7/getEncodedPluginsData.js");
const getPluginsEnableTypedData_js_2 = require("../kernel/utils/plugins/ep0_7/getPluginsEnableTypedData.js");
const isPluginInitialized_js_1 = require("../kernel/utils/plugins/ep0_7/isPluginInitialized.js");
function isKernelPluginManager(plugin) {
    return plugin.getPluginEnableSignature !== undefined;
}
exports.isKernelPluginManager = isKernelPluginManager;
async function toKernelPluginManager(client, { sudo, regular, pluginEnableSignature, validatorInitData, action, validAfter = 0, validUntil = 0, entryPoint: entryPointAddress, kernelVersion }) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    const chainId = await (0, actions_1.getChainId)(client);
    const activeValidator = regular || sudo;
    if (!activeValidator) {
        throw new Error("One of `sudo` or `regular` validator must be set");
    }
    action = {
        selector: action?.selector ?? (0, getActionSelector_js_1.getActionSelector)(entryPointVersion),
        address: action?.address ?? viem_1.zeroAddress
    };
    if (entryPointVersion === "v0.7" &&
        (action.address.toLowerCase() !== viem_1.zeroAddress.toLowerCase() ||
            action.selector.toLowerCase() !==
                (0, getActionSelector_js_1.getActionSelector)(entryPointVersion).toLowerCase())) {
        action.hook = {
            address: action.hook?.address ?? constants_js_1.ONLY_ENTRYPOINT_HOOK_ADDRESS
        };
    }
    if (!action) {
        throw new Error("Action data must be set");
    }
    const getSignatureData = async (accountAddress, selector, userOpSignature = "0x") => {
        if (!action) {
            throw new Error("Action data must be set");
        }
        if (entryPointVersion === "v0.6") {
            if (regular) {
                if (await isPluginEnabled(accountAddress, selector)) {
                    return kernel_js_1.ValidatorMode.plugin;
                }
                const enableSignature = await getPluginEnableSignature(accountAddress);
                if (!enableSignature) {
                    throw new Error("Enable signature not set");
                }
                return (0, getEncodedPluginsData_js_1.getEncodedPluginsData)({
                    accountAddress,
                    enableSignature,
                    action,
                    validator: regular,
                    validUntil,
                    validAfter
                });
            }
            else if (sudo) {
                return kernel_js_1.ValidatorMode.sudo;
            }
            else {
                throw new Error("One of `sudo` or `regular` validator must be set");
            }
        }
        if (regular) {
            if (await isPluginEnabled(accountAddress, action.selector)) {
                return userOpSignature;
            }
            const enableSignature = await getPluginEnableSignature(accountAddress);
            return (0, getEncodedPluginsData_js_2.getEncodedPluginsData)({
                accountAddress,
                action,
                enableSignature,
                userOpSignature,
                validator: regular
            });
        }
        else if (sudo) {
            return userOpSignature;
        }
        else {
            throw new Error("One of `sudo` or `regular` validator must be set");
        }
    };
    const isPluginEnabled = async (accountAddress, selector) => {
        if (!action) {
            throw new Error("Action data must be set");
        }
        if (!regular)
            throw new Error("regular validator not set");
        if (entryPointVersion === "v0.6") {
            return regular.isEnabled(accountAddress, selector);
        }
        return ((await regular.isEnabled(accountAddress, action.selector)) ||
            (await (0, isPluginInitialized_js_1.isPluginInitialized)(client, accountAddress, regular.address)));
    };
    const getPluginEnableSignature = async (accountAddress) => {
        if (!action) {
            throw new Error("Action data must be set");
        }
        if (pluginEnableSignature)
            return pluginEnableSignature;
        if (!sudo)
            throw new Error("sudo validator not set -- need it to enable the validator");
        if (!regular)
            throw new Error("regular validator not set");
        const { version } = await (0, accountMetadata_js_1.accountMetadata)(client, accountAddress, entryPointAddress);
        let ownerSig;
        if (entryPointVersion === "v0.6") {
            const typeData = await (0, getPluginsEnableTypedData_js_1.getPluginsEnableTypedData)({
                accountAddress,
                chainId,
                kernelVersion: kernelVersion ?? version,
                action,
                validator: regular,
                validUntil,
                validAfter
            });
            ownerSig = await sudo.signTypedData(typeData);
            pluginEnableSignature = ownerSig;
            return ownerSig;
        }
        const validatorNonce = await (0, getKernelV3Nonce_js_1.getKernelV3Nonce)(client, accountAddress);
        const typedData = await (0, getPluginsEnableTypedData_js_2.getPluginsEnableTypedData)({
            accountAddress,
            chainId,
            kernelVersion: version,
            action,
            validator: regular,
            validatorNonce
        });
        ownerSig = await sudo.signTypedData(typedData);
        return ownerSig;
    };
    const getIdentifier = (isSudo = false) => {
        const validator = (isSudo ? sudo : regular) ?? activeValidator;
        return (0, viem_1.concat)([
            constants_js_1.VALIDATOR_TYPE[validator.validatorType],
            validator.getIdentifier()
        ]);
    };
    return {
        ...activeValidator,
        getIdentifier,
        encodeModuleInstallCallData: async (accountAddress) => {
            if (!action) {
                throw new Error("Action data must be set");
            }
            if (!regular)
                throw new Error("regular validator not set");
            if (entryPointVersion === "v0.6") {
                return await (0, encodeModuleInstallCallData_js_1.encodeModuleInstallCallData)({
                    accountAddress,
                    selector: action.selector,
                    executor: action.address,
                    validator: regular?.address,
                    validUntil,
                    validAfter,
                    enableData: await regular.getEnableData(accountAddress)
                });
            }
            throw new Error("EntryPoint v0.7 not supported yet");
        },
        signUserOperation: async (userOperation) => {
            const userOpSig = await activeValidator.signUserOperation(userOperation);
            if (entryPointVersion === "v0.6") {
                return (0, viem_1.concatHex)([
                    await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10)),
                    userOpSig
                ]);
            }
            return await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10), userOpSig);
        },
        getAction: () => {
            if (!action) {
                throw new Error("Action data must be set");
            }
            return action;
        },
        getValidityData: () => ({
            validAfter,
            validUntil
        }),
        getDummySignature: async (userOperation) => {
            const userOpSig = await activeValidator.getDummySignature(userOperation);
            if (entryPointVersion === "v0.6") {
                return (0, viem_1.concatHex)([
                    await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10)),
                    userOpSig
                ]);
            }
            return await getSignatureData(userOperation.sender, userOperation.callData.toString().slice(0, 10), userOpSig);
        },
        getNonceKey: async (accountAddress = viem_1.zeroAddress, customNonceKey = 0n) => {
            if (!action) {
                throw new Error("Action data must be set");
            }
            if (entryPointVersion === "v0.6") {
                if (customNonceKey > viem_1.maxUint192) {
                    throw new Error("Custom nonce key must be equal or less than maxUint192 for v0.6");
                }
                return await activeValidator.getNonceKey(accountAddress, customNonceKey);
            }
            if (customNonceKey > viem_1.maxUint16)
                throw new Error("Custom nonce key must be equal or less than 2 bytes(maxUint16) for v0.7");
            const validatorMode = !regular ||
                (await isPluginEnabled(accountAddress, action.selector))
                ? constants_js_1.VALIDATOR_MODE.DEFAULT
                : constants_js_1.VALIDATOR_MODE.ENABLE;
            const validatorType = regular
                ? constants_js_1.VALIDATOR_TYPE[regular.validatorType]
                : constants_js_1.VALIDATOR_TYPE.SUDO;
            const encoding = (0, viem_1.pad)((0, viem_1.concatHex)([
                validatorMode,
                validatorType,
                (0, viem_1.pad)(activeValidator.getIdentifier(), {
                    size: 20,
                    dir: "right"
                }),
                (0, viem_1.pad)((0, viem_1.toHex)(await activeValidator.getNonceKey(accountAddress, customNonceKey)), {
                    size: 2
                })
            ]), { size: 24 });
            const encodedNonceKey = BigInt(encoding);
            return encodedNonceKey;
        },
        getPluginEnableSignature,
        getValidatorInitData: async () => {
            if (validatorInitData)
                return validatorInitData;
            return {
                validatorAddress: sudo?.address ?? activeValidator.address,
                enableData: (await sudo?.getEnableData()) ??
                    (await activeValidator.getEnableData()),
                identifier: (0, viem_1.pad)(getIdentifier(true), { size: 21, dir: "right" })
            };
        }
    };
}
exports.toKernelPluginManager = toKernelPluginManager;
//# sourceMappingURL=toKernelPluginManager.js.map