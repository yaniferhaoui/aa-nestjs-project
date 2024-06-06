import { createKernelAccount } from "@zerodev/sdk";
import type { ValidatorInitData } from "@zerodev/sdk/types";
import type { EntryPoint } from "permissionless/types";
import type { Hex } from "viem";
import type { Policy } from "./policies/types.js";
import type { ModularSigner } from "./signers/types.js";
export declare const deserializeModularPermissionAccount: <entryPoint extends EntryPoint>(client: Parameters<typeof createKernelAccount>[0], entryPointAddress: entryPoint, modularPermissionAccountParams: string, modularSigner?: ModularSigner) => Promise<import("@zerodev/sdk").KernelSmartAccount<entryPoint, import("viem").Transport, import("viem").Chain | undefined>>;
export declare const createPolicyFromParams: <entryPoint extends EntryPoint>(policy: Policy<entryPoint>) => Promise<Policy<import("permissionless/types/entrypoint.js").EntryPoint>>;
export declare const decodeParamsFromInitCode: (initCode: Hex) => {
    index: bigint;
    validatorInitData: ValidatorInitData;
};
//# sourceMappingURL=deserializeModularPermissionAccount.d.ts.map