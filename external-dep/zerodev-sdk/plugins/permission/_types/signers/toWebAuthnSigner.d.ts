import { type Chain, type Client, type Hex, type Transport } from "viem";
import type { ModularSigner, ModularSignerParams } from "../types.js";
import { WebAuthnMode } from "./toWebAuthnPubKey.js";
export type WebAuthnKey = {
    pubX: bigint;
    pubY: bigint;
    authenticatorIdHash: Hex;
};
export type WebAuthnModularSignerParams = ModularSignerParams & {
    passkeyName: string;
    passkeyServerUrl: string;
    pubKey?: WebAuthnKey;
    mode?: WebAuthnMode;
};
export declare const toWebAuthnSigner: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { signerContractAddress, pubKey, passkeyServerUrl, passkeyName, mode }: WebAuthnModularSignerParams) => Promise<ModularSigner>;
//# sourceMappingURL=toWebAuthnSigner.d.ts.map