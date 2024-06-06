import { type SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint.js";
import { type Address, type Chain, type Client, type Transport } from "viem";
import type { KernelSmartAccount } from "../createKernelAccount.js";
export type KernelV1SmartAccount<entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined> = Omit<KernelSmartAccount<entryPoint, transport, chain>, "kernelPluginManager">;
export declare function createKernelV1Account<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TSource extends string = string, TAddress extends Address = Address>(client: Client<TTransport, TChain, undefined>, { signer, entrypoint: entryPointAddress, index }: {
    signer: SmartAccountSigner<TSource, TAddress>;
    entrypoint: entryPoint;
    index?: bigint;
}): Promise<KernelV1SmartAccount<entryPoint, TTransport, TChain>>;
//# sourceMappingURL=createKernelV1Account.d.ts.map