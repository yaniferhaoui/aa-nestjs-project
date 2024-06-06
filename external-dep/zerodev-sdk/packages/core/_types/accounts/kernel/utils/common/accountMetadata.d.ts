import type { EntryPoint } from "permissionless/types/entrypoint.js";
import { type Address, type Chain, type Client, type Transport } from "viem";
type AccountMetadata = {
    name: string;
    version: string;
    chainId: bigint;
};
export declare const accountMetadata: <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, accountAddress: Address, entryPointAddress: EntryPoint) => Promise<AccountMetadata>;
export {};
//# sourceMappingURL=accountMetadata.d.ts.map