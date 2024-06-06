import { isModularPermissionValidatorPlugin, serializeModularPermissionAccountParams } from "./utils.js";
export const serializeModularPermissionAccount = async (account, privateKey) => {
    if (!isModularPermissionValidatorPlugin(account.kernelPluginManager))
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
    return serializeModularPermissionAccountParams(paramsToBeSerialized);
};
//# sourceMappingURL=serializeModularPermissionAccount.js.map