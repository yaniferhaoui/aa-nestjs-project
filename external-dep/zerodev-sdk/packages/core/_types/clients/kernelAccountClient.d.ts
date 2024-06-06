import type { SmartAccount } from "permissionless/accounts/types";
import type { Middleware } from "permissionless/actions/smartAccount";
import type { EntryPoint, Prettify } from "permissionless/types";
import type { BundlerRpcSchema } from "permissionless/types/bundler";
import { type Chain, type Client, type ClientConfig, type Transport } from "viem";
import type { KernelSmartAccount } from "../accounts/index.js";
import { type KernelAccountClientActions } from "./decorators/kernel.js";
export type KernelAccountClient<entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined, account extends KernelSmartAccount<entryPoint> | undefined = KernelSmartAccount<entryPoint> | undefined> = Client<transport, chain, account, BundlerRpcSchema<entryPoint>, KernelAccountClientActions<entryPoint, chain, account>>;
export type SmartAccountClientConfig<entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined, account extends SmartAccount<entryPoint> | undefined = SmartAccount<entryPoint> | undefined> = Prettify<Pick<ClientConfig<transport, chain, account>, "cacheTime" | "chain" | "key" | "name" | "pollingInterval"> & {
    account?: account;
    bundlerTransport: Transport;
} & Middleware<entryPoint> & {
    entryPoint: entryPoint;
}>;
export declare const createKernelAccountClient: <TSmartAccount extends KernelSmartAccount<TEntryPoint> | undefined, TTransport extends Transport = Transport, TChain extends Chain | undefined = undefined, TEntryPoint extends EntryPoint = TSmartAccount extends KernelSmartAccount<infer U extends EntryPoint> ? U : never>(parameters: {
    cacheTime?: number | undefined;
    chain?: Chain | TChain | undefined;
    key?: string | undefined;
    name?: string | undefined;
    pollingInterval?: number | undefined;
    account?: TSmartAccount | undefined;
    bundlerTransport: Transport;
    middleware?: {
        gasPrice?: (() => Promise<{
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
        }>) | undefined;
        sponsorUserOperation?: ((args: {
            userOperation: import("permissionless").UserOperation<import("permissionless/types/entrypoint.js").GetEntryPointVersion<TEntryPoint>>;
            entryPoint: TEntryPoint;
        }) => Promise<import("permissionless/actions/smartAccount").SponsorUserOperationReturnType<TEntryPoint>>) | undefined;
    } | ((args: {
        userOperation: import("permissionless").UserOperation<import("permissionless/types/entrypoint.js").GetEntryPointVersion<TEntryPoint>>;
        entryPoint: TEntryPoint;
    }) => Promise<import("permissionless").UserOperation<import("permissionless/types/entrypoint.js").GetEntryPointVersion<TEntryPoint>>>) | undefined;
    entryPoint: TEntryPoint;
}) => KernelAccountClient<TEntryPoint, TTransport, TChain, TSmartAccount>;
//# sourceMappingURL=kernelAccountClient.d.ts.map