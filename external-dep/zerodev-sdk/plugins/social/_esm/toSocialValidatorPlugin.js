import { OAuthExtension } from "@magic-ext/oauth";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { Magic } from "magic-sdk";
import { providerToSmartAccountSigner } from "permissionless";
export async function isAuthorized({ projectId }) {
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
export async function initiateLogin({ socialProvider, oauthCallbackUrl, projectId }) {
    const magic = await getMagic({ projectId });
    magic.oauth.loginWithRedirect({
        provider: socialProvider,
        redirectURI: oauthCallbackUrl ?? window.location.href
    });
}
export async function getSocialValidator(client, { entryPoint: entryPointAddress, projectId }) {
    const magic = await getMagic({ projectId });
    const authorized = await isAuthorized({ projectId });
    if (!authorized) {
        throw new Error("initiateLogin() must be called first.");
    }
    const magicProvider = await magic.wallet.getProvider();
    const smartAccountSigner = await providerToSmartAccountSigner(magicProvider);
    const ecdsaValidator = await signerToEcdsaValidator(client, {
        signer: smartAccountSigner,
        entryPoint: entryPointAddress
    });
    return {
        ...ecdsaValidator,
        source: "SocialValidator"
    };
}
export async function logout({ projectId }) {
    try {
        const magic = await getMagic({ projectId });
        await magic.user.logout();
    }
    catch (e) { }
}
async function getMagic({ projectId }) {
    const magicKey = await fetchMagicKey({ projectId });
    const magic = typeof window !== "undefined" &&
        new Magic(magicKey, {
            extensions: [new OAuthExtension()]
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