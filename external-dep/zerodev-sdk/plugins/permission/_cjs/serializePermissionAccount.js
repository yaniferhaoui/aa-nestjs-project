"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePermissionAccount = void 0;
const utils_js_1 = require("./utils.js");
const serializePermissionAccount = async (account, privateKey) => {
    if (!(0, utils_js_1.isPermissionValidatorPlugin)(account.kernelPluginManager))
        throw new Error("Account plugin is not a permission validator");
    const permissionParams = account.kernelPluginManager.getPluginSerializationParams();
    const action = account.kernelPluginManager.getAction();
    const validityData = account.kernelPluginManager.getValidityData();
    const enableSignature = await account.kernelPluginManager.getPluginEnableSignature(account.address);
    const accountParams = {
        initCode: await account.generateInitCode(),
        accountAddress: account.address
    };
    const paramsToBeSerialized = {
        permissionParams,
        action,
        validityData,
        accountParams,
        enableSignature,
        privateKey
    };
    return (0, utils_js_1.serializePermissionAccountParams)(paramsToBeSerialized);
};
exports.serializePermissionAccount = serializePermissionAccount;
//# sourceMappingURL=serializePermissionAccount.js.map