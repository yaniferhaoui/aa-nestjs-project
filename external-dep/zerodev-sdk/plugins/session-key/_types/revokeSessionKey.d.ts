import type { KernelAccountClient, KernelSmartAccount } from "@zerodev/sdk";
import { type Address, type Chain, type Hex, type Transport } from "viem";
export declare const revokeSessionKey: <entryPoint extends "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", TChain extends Chain | undefined = Chain | undefined, TTransport extends Transport = Transport>(accountClient: KernelAccountClient<entryPoint, TTransport, TChain, KernelSmartAccount<entryPoint, TTransport, TChain>>, sessionKeyAddress?: Address) => Promise<Hex>;
//# sourceMappingURL=revokeSessionKey.d.ts.map