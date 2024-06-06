import type { KernelSmartAccount } from "@zerodev/sdk";
import type { EntryPoint } from "permissionless/types";
import type { Hex } from "viem";
export declare const serializePermissionAccount: <entryPoint extends EntryPoint>(account: KernelSmartAccount<entryPoint>, privateKey?: Hex) => Promise<string>;
//# sourceMappingURL=serializePermissionAccount.d.ts.map