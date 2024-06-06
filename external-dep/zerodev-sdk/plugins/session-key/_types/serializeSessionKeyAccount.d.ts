import type { KernelSmartAccount } from "@zerodev/sdk";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Hex } from "viem";
export declare const serializeSessionKeyAccount: <entryPoint extends EntryPoint>(account: KernelSmartAccount<entryPoint>, privateKey?: Hex) => Promise<string>;
//# sourceMappingURL=serializeSessionKeyAccount.d.ts.map