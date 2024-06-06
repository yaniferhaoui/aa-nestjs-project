"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWebAuthnSigner = void 0;
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const viem_2 = require("viem");
const accounts_2 = require("viem/accounts");
const actions_1 = require("viem/actions");
const constants_js_1 = require("../constants.js");
const toWebAuthnPubKey_js_1 = require("./toWebAuthnPubKey.js");
const webAuthnUtils_js_1 = require("./webAuthnUtils.js");
const toWebAuthnSigner = async (client, { signerContractAddress = constants_js_1.WEBAUTHN_SIGNER_CONTRACT, pubKey, passkeyServerUrl, passkeyName, mode = toWebAuthnPubKey_js_1.WebAuthnMode.Register }) => {
    pubKey =
        pubKey ??
            (await (0, toWebAuthnPubKey_js_1.toWebAuthnPubKey)({
                passkeyName,
                passkeyServerUrl,
                mode
            }));
    if (!pubKey) {
        throw new Error("WebAuthn public key not found");
    }
    const chainId = await (0, actions_1.getChainId)(client);
    const signMessageUsingWebAuthn = async (message) => {
        let messageContent;
        if (typeof message === "string") {
            messageContent = message;
        }
        else if ("raw" in message && typeof message.raw === "string") {
            messageContent = message.raw;
        }
        else if ("raw" in message && message.raw instanceof Uint8Array) {
            messageContent = message.raw.toString();
        }
        else {
            throw new Error("Unsupported message format");
        }
        const formattedMessage = messageContent.startsWith("0x")
            ? messageContent.slice(2)
            : messageContent;
        if (window.sessionStorage === undefined) {
            throw new Error("sessionStorage is not available");
        }
        const userId = sessionStorage.getItem("userId");
        const signInitiateResponse = await fetch(`${passkeyServerUrl}/sign-initiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: formattedMessage, userId }),
            credentials: "include"
        });
        const signInitiateResult = await signInitiateResponse.json();
        const assertionOptions = {
            challenge: signInitiateResult.challenge,
            allowCredentials: signInitiateResult.allowCredentials,
            userVerification: "required"
        };
        const { startAuthentication } = await Promise.resolve().then(() => require("@simplewebauthn/browser"));
        const cred = await startAuthentication(assertionOptions);
        const verifyResponse = await fetch(`${passkeyServerUrl}/sign-verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cred, userId }),
            credentials: "include"
        });
        const verifyResult = await verifyResponse.json();
        if (!verifyResult.success) {
            throw new Error("Signature not verified");
        }
        const authenticatorData = verifyResult.authenticatorData;
        const authenticatorDataHex = (0, webAuthnUtils_js_1.uint8ArrayToHexString)((0, webAuthnUtils_js_1.b64ToBytes)(authenticatorData));
        const clientDataJSON = atob(cred.response.clientDataJSON);
        const { beforeType } = (0, webAuthnUtils_js_1.findQuoteIndices)(clientDataJSON);
        const signature = verifyResult.signature;
        const signatureHex = (0, webAuthnUtils_js_1.uint8ArrayToHexString)((0, webAuthnUtils_js_1.b64ToBytes)(signature));
        const { r, s } = (0, webAuthnUtils_js_1.parseAndNormalizeSig)(signatureHex);
        const encodedSignature = (0, viem_2.encodeAbiParameters)([
            { name: "authenticatorData", type: "bytes" },
            { name: "clientDataJSON", type: "string" },
            { name: "responseTypeLocation", type: "uint256" },
            { name: "r", type: "uint256" },
            { name: "s", type: "uint256" }
        ], [
            authenticatorDataHex,
            clientDataJSON,
            beforeType,
            BigInt(r),
            BigInt(s)
        ]);
        return encodedSignature;
    };
    const account = (0, accounts_2.toAccount)({
        address: "0x0000000000000000000000000000000000000000",
        async signMessage({ message }) {
            return signMessageUsingWebAuthn(message);
        },
        async signTransaction(_, __) {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            const { domain, message, primaryType } = typedData;
            const types = {
                EIP712Domain: (0, viem_1.getTypesForEIP712Domain)({ domain }),
                ...typedData.types
            };
            (0, viem_1.validateTypedData)({ domain, message, primaryType, types });
            const hash = (0, viem_1.hashTypedData)(typedData);
            return signMessageUsingWebAuthn(hash);
        }
    });
    return {
        account,
        signerContractAddress,
        getSignerData: () => {
            if (!pubKey) {
                throw new Error("WebAuthn public key not found");
            }
            return (0, viem_2.encodeAbiParameters)([
                { name: "pubX", type: "uint256" },
                { name: "pubY", type: "uint256" },
                { name: "usePrecompiled", type: "bool" }
            ], [pubKey.pubX, pubKey.pubY, (0, webAuthnUtils_js_1.isRIP7212SupportedNetwork)(chainId)]);
        },
        getDummySignature: () => {
            return (0, viem_2.encodeAbiParameters)([
                { name: "authenticatorData", type: "bytes" },
                { name: "clientDataJSON", type: "string" },
                { name: "responseTypeLocation", type: "uint256" },
                { name: "r", type: "uint256" },
                { name: "s", type: "uint256" }
            ], [
                "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d00000000",
                '{"type":"webauthn.get","challenge":"tbxXNFS9X_4Byr1cMwqKrIGB-_30a0QhZ6y7ucM0BOE","origin":"http://localhost:3000","crossOrigin":false}',
                1n,
                44941127272049826721201904734628716258498742255959991581049806490182030242267n,
                9910254599581058084911561569808925251374718953855182016200087235935345969636n
            ]);
        }
    };
};
exports.toWebAuthnSigner = toWebAuthnSigner;
//# sourceMappingURL=toWebAuthnSigner.js.map