import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Chain, type Client, type Transport } from "viem";
import type { Policy } from "./policies/types.js";
import type { ModularSigner } from "./signers/types.js";
import type { ModularPermissionPlugin } from "./types.js";
export declare function createPermissionValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { signer, entryPoint: entryPointAddress, policies, validUntil, validAfter, validatorAddress }: {
    signer: ModularSigner;
    validUntil?: number;
    validAfter?: number;
    policies: Policy<entryPoint>[];
    entryPoint: EntryPoint;
    validatorAddress?: Address;
}): Promise<ModularPermissionPlugin<entryPoint>>;
//# sourceMappingURL=toModularPermissionValidatorPlugin.d.ts.map