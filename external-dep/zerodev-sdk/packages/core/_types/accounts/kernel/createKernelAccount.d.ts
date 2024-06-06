import { type SmartAccount } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types";
import { type Address, type Chain, type Client, type Hex, type Transport } from "viem";
import type { KernelEncodeCallDataArgs, KernelPluginManager, KernelPluginManagerParams } from "../../types/kernel.js";
export type KernelSmartAccount<entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined> = SmartAccount<entryPoint, "kernelSmartAccount", transport, chain> & {
    kernelPluginManager: KernelPluginManager<entryPoint>;
    getNonce: (customNonceKey?: bigint) => Promise<bigint>;
    generateInitCode: () => Promise<Hex>;
    encodeCallData: (args: KernelEncodeCallDataArgs) => Promise<Hex>;
    encodeModuleInstallCallData: () => Promise<Hex>;
};
export type CreateKernelAccountParameters<entryPoint extends EntryPoint> = {
    plugins: Omit<KernelPluginManagerParams<entryPoint>, "entryPoint"> | KernelPluginManager<entryPoint>;
    entryPoint: entryPoint;
    index?: bigint;
    factoryAddress?: Address;
    accountLogicAddress?: Address;
    factoryStakerAddress?: Address;
    deployedAccountAddress?: Address;
};
/**
 * Default addresses for kernel smart account
 */
export declare const KERNEL_ADDRESSES: {
    ACCOUNT_LOGIC_V0_6: Address;
    ACCOUNT_LOGIC_V0_7: Address;
    FACTORY_ADDRESS_V0_6: Address;
    FACTORY_ADDRESS_V0_7: Address;
    FACTORY_STAKER: Address;
};
/**
 * Build a kernel smart account from a private key, that use the ECDSA signer behind the scene
 * @param client
 * @param privateKey
 * @param entryPoint
 * @param index
 * @param factoryAddress
 * @param accountLogicAddress
 * @param ecdsaValidatorAddress
 * @param deployedAccountAddress
 */
export declare function createKernelAccount<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { plugins, entryPoint: entryPointAddress, index, factoryAddress, accountLogicAddress, factoryStakerAddress, deployedAccountAddress }: CreateKernelAccountParameters<entryPoint>): Promise<KernelSmartAccount<entryPoint, TTransport, TChain>>;
//# sourceMappingURL=createKernelAccount.d.ts.map