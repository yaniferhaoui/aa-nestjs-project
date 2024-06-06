import { p256 } from "@noble/curves/p256";
import { bytesToBigInt, hexToBytes } from "viem";
const RIP7212_SUPPORTED_NETWORKS = [80001, 137];
export const isRIP7212SupportedNetwork = (chainId) => RIP7212_SUPPORTED_NETWORKS.includes(chainId);
export const uint8ArrayToHexString = (array) => {
    return `0x${Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
};
export const b64ToBytes = (base64) => {
    const paddedBase64 = base64
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binString = atob(paddedBase64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
};
export const findQuoteIndices = (input) => {
    const beforeTypeIndex = BigInt(input.lastIndexOf('"type":"webauthn.get"'));
    const beforeChallengeIndex = BigInt(input.indexOf('"challenge'));
    return {
        beforeType: beforeTypeIndex,
        beforeChallenge: beforeChallengeIndex
    };
};
// Parse DER-encoded P256-SHA256 signature to contract-friendly signature
// and normalize it so the signature is not malleable.
export function parseAndNormalizeSig(derSig) {
    const parsedSignature = p256.Signature.fromDER(derSig.slice(2));
    const bSig = hexToBytes(`0x${parsedSignature.toCompactHex()}`);
    // assert(bSig.length === 64, "signature is not 64 bytes");
    const bR = bSig.slice(0, 32);
    const bS = bSig.slice(32);
    // Avoid malleability. Ensure low S (<= N/2 where N is the curve order)
    const r = bytesToBigInt(bR);
    let s = bytesToBigInt(bS);
    const n = BigInt("0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");
    if (s > n / 2n) {
        s = n - s;
    }
    return { r, s };
}
export const serializePasskeyValidatorData = (params) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const replacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
    const jsonString = JSON.stringify(params, replacer);
    const uint8Array = new TextEncoder().encode(jsonString);
    const base64String = bytesToBase64(uint8Array);
    return base64String;
};
export const deserializePasskeyValidatorData = (params) => {
    const uint8Array = base64ToBytes(params);
    const jsonString = new TextDecoder().decode(uint8Array);
    return JSON.parse(jsonString);
};
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}
//# sourceMappingURL=utils.js.map