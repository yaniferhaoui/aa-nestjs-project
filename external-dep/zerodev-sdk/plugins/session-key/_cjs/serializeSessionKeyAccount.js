"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSessionKeyAccount = void 0;
const utils_js_1 = require("./utils.js");
const serializeSessionKeyAccount = async (account, privateKey) => {
    if (!(0, utils_js_1.isSessionKeyValidatorPlugin)(account.kernelPluginManager))
        throw new Error("Account plugin is not a session key validator");
    const sessionKeyParams = account.kernelPluginManager.getPluginSerializationParams();
    const action = account.kernelPluginManager.getAction();
    const validityData = account.kernelPluginManager.getValidityData();
    const enableSignature = await account.kernelPluginManager.getPluginEnableSignature(account.address);
    const accountParams = {
        initCode: await account.getInitCode(),
        accountAddress: account.address
    };
    const paramsToBeSerialized = {
        sessionKeyParams,
        action,
        validityData,
        accountParams,
        enableSignature,
        privateKey
    };
    return (0, utils_js_1.serializeSessionKeyAccountParams)(paramsToBeSerialized);
};
exports.serializeSessionKeyAccount = serializeSessionKeyAccount;
//# sourceMappingURL=serializeSessionKeyAccount.js.map