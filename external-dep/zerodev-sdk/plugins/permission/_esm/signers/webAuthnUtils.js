import { p256 } from "@noble/curves/p256";
import { bytesToBigInt, hexToBytes } from "viem";
const RIP7212_SUPPORTED_NETWORKS = [80001];
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
export const isRIP7212SupportedNetwork = (chainId) => RIP7212_SUPPORTED_NETWORKS.includes(chainId);
//# sourceMappingURL=webAuthnUtils.js.map