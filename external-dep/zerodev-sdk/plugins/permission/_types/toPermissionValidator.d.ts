import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Chain, type Client, type Transport } from "viem";
import type { PermissionPlugin, PermissionPluginParams } from "./types.js";
export declare function toPermissionValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { signer, policies, entryPoint: entryPointAddress, flag }: PermissionPluginParams): Promise<PermissionPlugin<entryPoint>>;
//# sourceMappingURL=toPermissionValidator.d.ts.map