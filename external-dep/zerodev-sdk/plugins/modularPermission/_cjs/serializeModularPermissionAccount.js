"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeModularPermissionAccount = void 0;
const utils_js_1 = require("./utils.js");
const serializeModularPermissionAccount = async (account, privateKey) => {
    if (!(0, utils_js_1.isModularPermissionValidatorPlugin)(account.kernelPluginManager))
        throw new Error("Account plugin is not a modular permission validator");
    const modularPermissionParams = account.kernelPluginManager.getPluginSerializationParams();
    const action = account.kernelPluginManager.getAction();
    const validityData = account.kernelPluginManager.getValidityData();
    const enableSignature = await account.kernelPluginManager.getPluginEnableSignature(account.address);
    const accountParams = {
        initCode: await account.getInitCode(),
        accountAddress: account.address
    };
    const paramsToBeSerialized = {
        modularPermissionParams,
        action,
        validityData,
        accountParams,
        enableSignature,
        privateKey
    };
    return (0, utils_js_1.serializeModularPermissionAccountParams)(paramsToBeSerialized);
};
exports.serializeModularPermissionAccount = serializeModularPermissionAccount;
//# sourceMappingURL=serializeModularPermissionAccount.js.map