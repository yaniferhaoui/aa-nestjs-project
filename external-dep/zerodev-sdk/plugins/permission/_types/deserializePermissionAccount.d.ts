import { createKernelAccount } from "@zerodev/sdk";
import type { ValidatorInitData } from "@zerodev/sdk/types";
import type { EntryPoint } from "permissionless/types";
import type { Hex } from "viem";
import type { Policy } from "./types.js";
import type { ModularSigner } from "./types.js";
export declare const deserializePermissionAccount: <entryPoint extends EntryPoint>(client: Parameters<typeof createKernelAccount>[0], entryPointAddress: entryPoint, modularPermissionAccountParams: string, modularSigner?: ModularSigner) => Promise<import("@zerodev/sdk").KernelSmartAccount<entryPoint, import("viem").Transport, import("viem").Chain | undefined>>;
export declare const createPolicyFromParams: (policy: Policy) => Promise<Policy>;
export declare const decodeParamsFromInitCode: (initCode: Hex) => {
    index: bigint;
    validatorInitData: ValidatorInitData;
};
//# sourceMappingURL=deserializePermissionAccount.d.ts.map