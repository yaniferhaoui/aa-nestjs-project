import { type Chain, type Client, type Transport } from "viem";
import { WebAuthnMode } from "./toWebAuthnPubKey.js";
import type { ModularSigner, ModularSignerParams } from "./types.js";
export type WebAuthnKey = {
    pubX: bigint;
    pubY: bigint;
};
export type WebAuthnModularSignerParams = ModularSignerParams & {
    passkeyName: string;
    passkeyServerUrl: string;
    pubKey?: WebAuthnKey;
    mode?: WebAuthnMode;
};
export declare const toWebAuthnSigner: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { signerContractAddress, pubKey, passkeyServerUrl, passkeyName, mode }: WebAuthnModularSignerParams) => Promise<ModularSigner>;
//# sourceMappingURL=toWebAuthnSigner.d.ts.map