import { isSessionKeyValidatorPlugin, serializeSessionKeyAccountParams } from "./utils.js";
export const serializeSessionKeyAccount = async (account, privateKey) => {
    if (!isSessionKeyValidatorPlugin(account.kernelPluginManager))
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
    return serializeSessionKeyAccountParams(paramsToBeSerialized);
};
//# sourceMappingURL=serializeSessionKeyAccount.js.map