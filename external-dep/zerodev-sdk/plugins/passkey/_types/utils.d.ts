import { type Hex } from "viem";
export declare const isRIP7212SupportedNetwork: (chainId: number) => boolean;
export declare const uint8ArrayToHexString: (array: Uint8Array) => `0x${string}`;
export declare const b64ToBytes: (base64: string) => Uint8Array;
export declare const findQuoteIndices: (input: string) => {
    beforeType: bigint;
    beforeChallenge: bigint;
};
export declare function parseAndNormalizeSig(derSig: Hex): {
    r: bigint;
    s: bigint;
};
type PasskeyValidatorSerializedData = {
    passkeyServerUrl: string;
    entryPoint: Hex;
    validatorAddress: Hex;
    pubKeyX: string;
    pubKeyY: string;
    authenticatorIdHash: Hex;
};
export declare const serializePasskeyValidatorData: (params: PasskeyValidatorSerializedData) => string;
export declare const deserializePasskeyValidatorData: (params: string) => PasskeyValidatorSerializedData;
export {};
//# sourceMappingURL=utils.d.ts.map