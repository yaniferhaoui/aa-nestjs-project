"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRIP7212SupportedNetwork = exports.parseAndNormalizeSig = exports.findQuoteIndices = exports.b64ToBytes = exports.uint8ArrayToHexString = void 0;
const p256_1 = require("@noble/curves/p256");
const viem_1 = require("viem");
const RIP7212_SUPPORTED_NETWORKS = [80001];
const uint8ArrayToHexString = (array) => {
    return `0x${Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
};
exports.uint8ArrayToHexString = uint8ArrayToHexString;
const b64ToBytes = (base64) => {
    const paddedBase64 = base64
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binString = atob(paddedBase64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
};
exports.b64ToBytes = b64ToBytes;
const findQuoteIndices = (input) => {
    const beforeTypeIndex = BigInt(input.lastIndexOf('"type":"webauthn.get"'));
    const beforeChallengeIndex = BigInt(input.indexOf('"challenge'));
    return {
        beforeType: beforeTypeIndex,
        beforeChallenge: beforeChallengeIndex
    };
};
exports.findQuoteIndices = findQuoteIndices;
function parseAndNormalizeSig(derSig) {
    const parsedSignature = p256_1.p256.Signature.fromDER(derSig.slice(2));
    const bSig = (0, viem_1.hexToBytes)(`0x${parsedSignature.toCompactHex()}`);
    const bR = bSig.slice(0, 32);
    const bS = bSig.slice(32);
    const r = (0, viem_1.bytesToBigInt)(bR);
    let s = (0, viem_1.bytesToBigInt)(bS);
    const n = BigInt("0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");
    if (s > n / 2n) {
        s = n - s;
    }
    return { r, s };
}
exports.parseAndNormalizeSig = parseAndNormalizeSig;
const isRIP7212SupportedNetwork = (chainId) => RIP7212_SUPPORTED_NETWORKS.includes(chainId);
exports.isRIP7212SupportedNetwork = isRIP7212SupportedNetwork;
//# sourceMappingURL=webAuthnUtils.js.map