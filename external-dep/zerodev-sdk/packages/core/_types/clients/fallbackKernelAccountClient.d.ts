import type { EntryPoint } from "permissionless/types";
import type { Chain, Transport } from "viem";
import type { KernelSmartAccount } from "../accounts/index.js";
import type { KernelAccountClient } from "./kernelAccountClient.js";
export declare const createFallbackKernelAccountClient: <TEntryPoint extends EntryPoint, TTransport extends Transport, TChain extends Chain | undefined, TSmartAccount extends KernelSmartAccount<TEntryPoint> | undefined>(clients: KernelAccountClient<TEntryPoint, TTransport, TChain, TSmartAccount>[]) => KernelAccountClient<TEntryPoint, TTransport, TChain, TSmartAccount>;
//# sourceMappingURL=fallbackKernelAccountClient.d.ts.map