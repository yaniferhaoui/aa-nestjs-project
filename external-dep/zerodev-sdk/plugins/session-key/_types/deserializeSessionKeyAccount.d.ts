import { type KernelSmartAccount, createKernelAccount } from "@zerodev/sdk";
import type { ValidatorInitData } from "@zerodev/sdk/types";
import type { SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Chain, Hex, Transport } from "viem";
export declare const deserializeSessionKeyAccount: <entryPoint extends EntryPoint, TSource extends string = "custom", TAddress extends `0x${string}` = `0x${string}`>(client: Parameters<typeof createKernelAccount>[0], entryPointAddress: entryPoint, sessionKeyAccountParams: string, sessionKeySigner?: SmartAccountSigner<TSource, TAddress> | undefined) => Promise<KernelSmartAccount<entryPoint, Transport, Chain | undefined>>;
export declare const decodeParamsFromInitCode: (initCode: Hex) => {
    index: bigint | undefined;
    validatorInitData: ValidatorInitData | undefined;
};
//# sourceMappingURL=deserializeSessionKeyAccount.d.ts.map