"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getSocialValidator = exports.initiateLogin = exports.isAuthorized = void 0;
const oauth_1 = require("@magic-ext/oauth");
const ecdsa_validator_1 = require("@zerodev/ecdsa-validator");
const magic_sdk_1 = require("magic-sdk");
const permissionless_1 = require("permissionless");
async function isAuthorized({ projectId }) {
    try {
        const magic = await getMagic({ projectId });
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn)
            return true;
        const result = await magic.oauth.getRedirectResult();
        return result !== null;
    }
    catch { }
    return false;
}
exports.isAuthorized = isAuthorized;
async function initiateLogin({ socialProvider, oauthCallbackUrl, projectId }) {
    const magic = await getMagic({ projectId });
    magic.oauth.loginWithRedirect({
        provider: socialProvider,
        redirectURI: oauthCallbackUrl ?? window.location.href
    });
}
exports.initiateLogin = initiateLogin;
async function getSocialValidator(client, { entryPoint: entryPointAddress, projectId }) {
    const magic = await getMagic({ projectId });
    const authorized = await isAuthorized({ projectId });
    if (!authorized) {
        throw new Error("initiateLogin() must be called first.");
    }
    const magicProvider = await magic.wallet.getProvider();
    const smartAccountSigner = await (0, permissionless_1.providerToSmartAccountSigner)(magicProvider);
    const ecdsaValidator = await (0, ecdsa_validator_1.signerToEcdsaValidator)(client, {
        signer: smartAccountSigner,
        entryPoint: entryPointAddress
    });
    return {
        ...ecdsaValidator,
        source: "SocialValidator"
    };
}
exports.getSocialValidator = getSocialValidator;
async function logout({ projectId }) {
    try {
        const magic = await getMagic({ projectId });
        await magic.user.logout();
    }
    catch (e) { }
}
exports.logout = logout;
async function getMagic({ projectId }) {
    const magicKey = await fetchMagicKey({ projectId });
    const magic = typeof window !== "undefined" &&
        new magic_sdk_1.Magic(magicKey, {
            extensions: [new oauth_1.OAuthExtension()]
        });
    if (!magic) {
        throw new Error("Failed to initialize Magic SDK");
    }
    return magic;
}
async function fetchMagicKey({ projectId }) {
    const serverUrl = "https://backend-vikp.onrender.com/v1/social/key";
    const response = await fetch(`${serverUrl}?projectId=${projectId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Magic key: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.key;
}
//# sourceMappingURL=toSocialValidatorPlugin.js.map