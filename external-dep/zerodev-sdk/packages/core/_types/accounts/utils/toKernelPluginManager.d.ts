import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Chain, type Client, type Transport } from "viem";
import { type KernelPluginManager, type KernelPluginManagerParams } from "../../types/kernel.js";
export declare function isKernelPluginManager<entryPoint extends EntryPoint>(plugin: any): plugin is KernelPluginManager<entryPoint>;
export declare function toKernelPluginManager<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { sudo, regular, pluginEnableSignature, validatorInitData, action, validAfter, validUntil, entryPoint: entryPointAddress, kernelVersion }: KernelPluginManagerParams<entryPoint>): Promise<KernelPluginManager<entryPoint>>;
//# sourceMappingURL=toKernelPluginManager.d.ts.map