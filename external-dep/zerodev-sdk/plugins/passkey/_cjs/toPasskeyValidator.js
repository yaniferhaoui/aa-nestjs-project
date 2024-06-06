"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializePasskeyValidator = exports.getPasskeyValidator = exports.createPasskeyValidator = void 0;
const buffer_1 = require("buffer");
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const actions_1 = require("viem/actions");
const actions_2 = require("viem/actions");
const index_js_1 = require("./index.js");
const utils_js_1 = require("./utils.js");
const createEnableData = (pubKeyX, pubKeyY, authenticatorIdHash) => {
    return (0, viem_1.encodeAbiParameters)([
        {
            components: [
                { name: "x", type: "uint256" },
                { name: "y", type: "uint256" }
            ],
            name: "webAuthnData",
            type: "tuple"
        },
        {
            name: "authenticatorIdHash",
            type: "bytes32"
        }
    ], [
        {
            x: BigInt(`0x${pubKeyX}`),
            y: BigInt(`0x${pubKeyY}`)
        },
        authenticatorIdHash
    ]);
};
const createDummySignatrue = () => {
    return (0, viem_1.encodeAbiParameters)([
        { name: "authenticatorData", type: "bytes" },
        { name: "clientDataJSON", type: "string" },
        { name: "responseTypeLocation", type: "uint256" },
        { name: "r", type: "uint256" },
        { name: "s", type: "uint256" },
        { name: "usePrecompiled", type: "bool" }
    ], [
        "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d00000000",
        '{"type":"webauthn.get","challenge":"tbxXNFS9X_4Byr1cMwqKrIGB-_30a0QhZ6y7ucM0BOE","origin":"http://localhost:3000","crossOrigin":false}',
        1n,
        44941127272049826721201904734628716258498742255959991581049806490182030242267n,
        9910254599581058084911561569808925251374718953855182016200087235935345969636n,
        false
    ]);
};
const doSignMessage = async (message, passkeyServerUrl, chainId) => {
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
    const authenticatorDataHex = (0, utils_js_1.uint8ArrayToHexString)((0, utils_js_1.b64ToBytes)(authenticatorData));
    const clientDataJSON = atob(cred.response.clientDataJSON);
    const { beforeType } = (0, utils_js_1.findQuoteIndices)(clientDataJSON);
    const signature = verifyResult.signature;
    const signatureHex = (0, utils_js_1.uint8ArrayToHexString)((0, utils_js_1.b64ToBytes)(signature));
    const { r, s } = (0, utils_js_1.parseAndNormalizeSig)(signatureHex);
    const signatureComponents = [
        { name: "authenticatorData", type: "bytes" },
        { name: "clientDataJSON", type: "string" },
        { name: "responseTypeLocation", type: "uint256" },
        { name: "r", type: "uint256" },
        { name: "s", type: "uint256" },
        { name: "usePrecompiled", type: "bool" }
    ];
    return (0, viem_1.encodeAbiParameters)(signatureComponents, [
        authenticatorDataHex,
        clientDataJSON,
        beforeType,
        BigInt(r),
        BigInt(s),
        (0, utils_js_1.isRIP7212SupportedNetwork)(chainId)
    ]);
};
async function createPasskeyValidator(client, { passkeyName, passkeyServerUrl, entryPoint: entryPointAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress);
    const registerOptionsResponse = await fetch(`${passkeyServerUrl}/register/options`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: passkeyName }),
        credentials: "include"
    });
    const registerOptionsResult = await registerOptionsResponse.json();
    if (window.sessionStorage === undefined) {
        throw new Error("sessionStorage is not available");
    }
    sessionStorage.setItem("userId", registerOptionsResult.userId);
    const { startRegistration } = await Promise.resolve().then(() => require("@simplewebauthn/browser"));
    const registerCred = await startRegistration(registerOptionsResult.options);
    const authenticatorIdHash = (0, viem_1.keccak256)((0, utils_js_1.uint8ArrayToHexString)((0, utils_js_1.b64ToBytes)(registerCred.id)));
    const registerVerifyResponse = await fetch(`${passkeyServerUrl}/register/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: registerOptionsResult.userId,
            username: passkeyName,
            cred: registerCred
        }),
        credentials: "include"
    });
    const registerVerifyResult = await registerVerifyResponse.json();
    if (!registerVerifyResult.verified) {
        throw new Error("Registration not verified");
    }
    const pubKey = registerCred.response.publicKey;
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
    const chainId = await (0, actions_2.getChainId)(client);
    const account = (0, accounts_2.toAccount)({
        address: "0x0000000000000000000000000000000000000000",
        async signMessage({ message }) {
            return doSignMessage(message, passkeyServerUrl, chainId);
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
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: hash
            });
            return signature;
        }
    });
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "WebAuthnValidator",
        getIdentifier() {
            return validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress);
        },
        async getEnableData() {
            return createEnableData(pubKeyX, pubKeyY, authenticatorIdHash);
        },
        async getNonceKey(_accountAddress, customNonceKey) {
            if (customNonceKey) {
                return customNonceKey;
            }
            return 0n;
        },
        async signUserOperation(userOperation) {
            const hash = (0, permissionless_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: { raw: hash }
            });
            return signature;
        },
        async getDummySignature() {
            return createDummySignatrue();
        },
        async isEnabled(_kernelAccountAddress, _selector) {
            return false;
        },
        getSerializedData() {
            return (0, utils_js_1.serializePasskeyValidatorData)({
                passkeyServerUrl,
                entryPoint: entryPointAddress,
                validatorAddress: validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress),
                pubKeyX,
                pubKeyY,
                authenticatorIdHash
            });
        }
    };
}
exports.createPasskeyValidator = createPasskeyValidator;
async function getPasskeyValidator(client, { passkeyServerUrl, entryPoint: entryPointAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress);
    const loginOptionsResponse = await fetch(`${passkeyServerUrl}/login/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const loginOptions = await loginOptionsResponse.json();
    const { startAuthentication } = await Promise.resolve().then(() => require("@simplewebauthn/browser"));
    const loginCred = await startAuthentication(loginOptions);
    const authenticatorIdHash = (0, viem_1.keccak256)((0, utils_js_1.uint8ArrayToHexString)((0, utils_js_1.b64ToBytes)(loginCred.id)));
    const loginVerifyResponse = await fetch(`${passkeyServerUrl}/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cred: loginCred }),
        credentials: "include"
    });
    const loginVerifyResult = await loginVerifyResponse.json();
    if (!loginVerifyResult.verification.verified) {
        throw new Error("Login not verified");
    }
    if (window.sessionStorage === undefined) {
        throw new Error("sessionStorage is not available");
    }
    sessionStorage.setItem("userId", loginVerifyResult.userId);
    const pubKey = loginVerifyResult.pubkey;
    if (!pubKey) {
        throw new Error("No public key returned from login verify credential");
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
    const chainId = await (0, actions_2.getChainId)(client);
    const account = (0, accounts_2.toAccount)({
        address: "0x0000000000000000000000000000000000000000",
        async signMessage({ message }) {
            return doSignMessage(message, passkeyServerUrl, chainId);
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
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: hash
            });
            return signature;
        }
    });
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "WebAuthnValidator",
        getIdentifier: () => validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress),
        async getEnableData() {
            return createEnableData(pubKeyX, pubKeyY, authenticatorIdHash);
        },
        async getNonceKey() {
            return 0n;
        },
        async signUserOperation(userOperation) {
            const hash = (0, permissionless_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: { raw: hash }
            });
            return signature;
        },
        async getDummySignature() {
            return createDummySignatrue();
        },
        async isEnabled(_kernelAccountAddress, _selector) {
            return false;
        },
        getSerializedData() {
            return (0, utils_js_1.serializePasskeyValidatorData)({
                passkeyServerUrl,
                entryPoint: entryPointAddress,
                validatorAddress: validatorAddress ?? (0, index_js_1.getValidatorAddress)(entryPointAddress),
                pubKeyX,
                pubKeyY,
                authenticatorIdHash
            });
        }
    };
}
exports.getPasskeyValidator = getPasskeyValidator;
async function deserializePasskeyValidator(client, { serializedData, entryPoint: entryPointAddress }) {
    const { passkeyServerUrl, entryPoint, validatorAddress, pubKeyX, pubKeyY, authenticatorIdHash } = (0, utils_js_1.deserializePasskeyValidatorData)(serializedData);
    const chainId = await (0, actions_2.getChainId)(client);
    const account = (0, accounts_2.toAccount)({
        address: "0x0000000000000000000000000000000000000000",
        async signMessage({ message }) {
            return doSignMessage(message, passkeyServerUrl, chainId);
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
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: hash
            });
            return signature;
        }
    });
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "WebAuthnValidator",
        getIdentifier: () => validatorAddress,
        async getEnableData() {
            return createEnableData(pubKeyX, pubKeyY, authenticatorIdHash);
        },
        async getNonceKey() {
            return 0n;
        },
        async signUserOperation(userOperation) {
            const hash = (0, permissionless_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account,
                message: { raw: hash }
            });
            return signature;
        },
        async getDummySignature() {
            return createDummySignatrue();
        },
        async isEnabled(_kernelAccountAddress, _selector) {
            return false;
        },
        getSerializedData() {
            return (0, utils_js_1.serializePasskeyValidatorData)({
                passkeyServerUrl,
                entryPoint,
                validatorAddress,
                pubKeyX,
                pubKeyY,
                authenticatorIdHash
            });
        }
    };
}
exports.deserializePasskeyValidator = deserializePasskeyValidator;
//# sourceMappingURL=toPasskeyValidator.js.map