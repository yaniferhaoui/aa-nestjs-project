"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWebAuthnPubKey = exports.WebAuthnMode = void 0;
const buffer_1 = require("buffer");
const viem_1 = require("viem");
const webAuthnUtils_js_1 = require("./webAuthnUtils.js");
var WebAuthnMode;
(function (WebAuthnMode) {
    WebAuthnMode["Register"] = "register";
    WebAuthnMode["Login"] = "login";
})(WebAuthnMode || (exports.WebAuthnMode = WebAuthnMode = {}));
const toWebAuthnPubKey = async ({ passkeyName, passkeyServerUrl, mode = WebAuthnMode.Login }) => {
    let pubKey;
    let authenticatorIdHash;
    if (mode === WebAuthnMode.Login) {
        const loginOptionsResponse = await fetch(`${passkeyServerUrl}/login/options`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const loginOptions = await loginOptionsResponse.json();
        const { startAuthentication } = await Promise.resolve().then(() => require("@simplewebauthn/browser"));
        const loginCred = await startAuthentication(loginOptions);
        authenticatorIdHash = (0, viem_1.keccak256)((0, webAuthnUtils_js_1.uint8ArrayToHexString)((0, webAuthnUtils_js_1.b64ToBytes)(loginCred.id)));
        const loginVerifyResponse = await fetch(`${passkeyServerUrl}/login/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cred: loginCred }),
            credentials: "include"
        });
        const loginVerifyResult = await loginVerifyResponse.json();
        if (window.sessionStorage === undefined) {
            throw new Error("sessionStorage is not available");
        }
        sessionStorage.setItem("userId", loginVerifyResult.userId);
        if (!loginVerifyResult.verification.verified) {
            throw new Error("Login not verified");
        }
        pubKey = loginVerifyResult.pubkey;
    }
    else {
        if (!passkeyName) {
            throw new Error("No passkey name provided");
        }
        const registerOptionsResponse = await fetch(`${passkeyServerUrl}/register/options`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: passkeyName }),
            credentials: "include"
        });
        const registerOptions = await registerOptionsResponse.json();
        if (window.sessionStorage === undefined) {
            throw new Error("sessionStorage is not available");
        }
        sessionStorage.setItem("userId", registerOptions.userId);
        const { startRegistration } = await Promise.resolve().then(() => require("@simplewebauthn/browser"));
        const registerCred = await startRegistration(registerOptions.options);
        authenticatorIdHash = (0, viem_1.keccak256)((0, webAuthnUtils_js_1.uint8ArrayToHexString)((0, webAuthnUtils_js_1.b64ToBytes)(registerCred.id)));
        const registerVerifyResponse = await fetch(`${passkeyServerUrl}/register/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: registerOptions.userId,
                username: passkeyName,
                cred: registerCred
            }),
            credentials: "include"
        });
        const registerVerifyResult = await registerVerifyResponse.json();
        if (!registerVerifyResult.verified) {
            throw new Error("Registration not verified");
        }
        pubKey = registerCred.response.publicKey;
    }
    if (!pubKey) {
        throw new Error("No public key returned from registration credential");
    }
    const spkiDer = buffer_1.Buffer.from(pubKey, "base64");
    const key = await crypto.subtle.importKey("spki", spkiDer, {
        name: "ECDSA",
        namedCurve: "P-256"
    }, true, ["verify"]);
    const rawKey = await crypto.subtle.exportKey("raw", key);
    const rawKeyBuffer = buffer_1.Buffer.from(rawKey);
    const pubKeyX = rawKeyBuffer.subarray(1, 33).toString("hex");
    const pubKeyY = rawKeyBuffer.subarray(33).toString("hex");
    return {
        pubX: BigInt(`0x${pubKeyX}`),
        pubY: BigInt(`0x${pubKeyY}`),
        authenticatorIdHash
    };
};
exports.toWebAuthnPubKey = toWebAuthnPubKey;
//# sourceMappingURL=toWebAuthnPubKey.js.map