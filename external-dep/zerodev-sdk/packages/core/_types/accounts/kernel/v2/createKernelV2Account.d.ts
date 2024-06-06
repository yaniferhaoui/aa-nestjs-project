import type { EntryPoint } from "permissionless/types/entrypoint.js";
import { type Address, type Chain, type Client, type Transport } from "viem";
import type { KernelPluginManager, KernelPluginManagerParams } from "../../../types/kernel.js";
import type { KernelSmartAccount } from "../createKernelAccount.js";
/**
 * Default addresses for kernel smart account
 */
export declare const KERNEL_ADDRESSES: {
    FACTORY_ADDRESS: Address;
    ENTRYPOINT_V0_6: Address;
};
/**
 * Build a kernel smart account from a private key, that use the ECDSA signer behind the scene
 * @param client
 * @param privateKey
 * @param entryPoint
 * @param index
 * @param factoryAddress
 * @param ecdsaValidatorAddress
 * @param deployedAccountAddress
 */
export declare function createKernelV2Account<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { plugins, entryPoint: entryPointAddress, index, factoryAddress, deployedAccountAddress }: {
    plugins: KernelPluginManagerParams<entryPoint> | KernelPluginManager<entryPoint>;
    entryPoint: entryPoint;
    index?: bigint;
    factoryAddress?: Address;
    deployedAccountAddress?: Address;
}): Promise<KernelSmartAccount<entryPoint, TTransport, TChain>>;
//# sourceMappingURL=createKernelV2Account.d.ts.map