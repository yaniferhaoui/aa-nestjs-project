import { createKernelV2Account } from "@zerodev/sdk/accounts";
import type { ValidatorInitData } from "@zerodev/sdk/types";
import type { SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Hex } from "viem";
export declare const deserializeSessionKeyAccountV2: <entryPoint extends EntryPoint, TSource extends string = "custom", TAddress extends `0x${string}` = `0x${string}`>(client: Parameters<typeof createKernelV2Account>[0], entryPointAddress: entryPoint, sessionKeyAccountParams: string, sessionKeySigner?: SmartAccountSigner<TSource, TAddress> | undefined) => Promise<import("@zerodev/sdk/accounts").KernelSmartAccount<entryPoint, import("viem").Transport, import("viem").Chain | undefined>>;
export declare const decodeParamsFromInitCodeV2: (initCode: Hex) => {
    index: bigint | undefined;
    validatorInitData: ValidatorInitData | undefined;
};
//# sourceMappingURL=deserializeSessionKeyAccountV2.d.ts.map