import { type SmartAccountActions } from "permissionless";
import type { Middleware } from "permissionless/actions/smartAccount";
import type { EntryPoint, Prettify } from "permissionless/types";
import type { Chain, Client, Transport } from "viem";
import type { KernelSmartAccount } from "../../accounts/index.js";
import { type GetUserOperationGasPriceReturnType } from "../../actions/account-client/getUserOperationGasPrice.js";
import { type PrepareUserOperationReturnType, prepareUserOperation, type SignUserOperationReturnType, signUserOperation } from "../../actions/index.js";
import { type EstimateGasInERC20Parameters, type EstimateGasInERC20ReturnType } from "../../actions/paymaster/estimateGasInERC20.js";
import { type SponsorUserOperationParameters, type SponsorUserOperationReturnType } from "../../actions/paymaster/sponsorUserOperation.js";
export type ZeroDevPaymasterClientActions<entryPoint extends EntryPoint> = {
    /**
     * Returns paymasterAndData & updated gas parameters required to sponsor a userOperation.
     */
    sponsorUserOperation: (args: SponsorUserOperationParameters<entryPoint>) => Promise<SponsorUserOperationReturnType<entryPoint>>;
    estimateGasInERC20: (args: EstimateGasInERC20Parameters) => Promise<EstimateGasInERC20ReturnType>;
};
export declare const zerodevPaymasterActions: <entryPoint extends EntryPoint>(entryPointAddress: entryPoint) => (client: Client) => ZeroDevPaymasterClientActions<entryPoint>;
export type KernelAccountClientActions<entryPoint extends EntryPoint, TChain extends Chain | undefined = Chain | undefined, TSmartAccount extends KernelSmartAccount<entryPoint> | undefined = KernelSmartAccount<entryPoint> | undefined> = SmartAccountActions<entryPoint, TChain, TSmartAccount> & {
    /**
     * Signs a user operation with the given transport, chain, and smart account.
     *
     * @param args - Parameters for the signUserOperation function
     * @returns A promise that resolves to the result of the signUserOperation function
     */
    signUserOperation: <TTransport extends Transport>(args: Parameters<typeof signUserOperation<entryPoint, TTransport, TChain, TSmartAccount>>[1]) => Promise<SignUserOperationReturnType<entryPoint>>;
    /**
     * Prepare a user operation with the given transport, chain, and smart account.
     *
     * @param args - Parameters for the prepareUserOperation function
     * @returns A promise that resolves to the result of the prepareUserOperation function
     */
    prepareUserOperation: <TTransport extends Transport>(args: Parameters<typeof prepareUserOperation<entryPoint, TTransport, TChain, TSmartAccount>>[1]) => Promise<PrepareUserOperationReturnType<entryPoint>>;
    /**
     * Returns the live gas prices that you can use to send a user operation.
     *
     * @returns maxFeePerGas & maxPriorityFeePerGas {@link GetUserOperationGasPriceReturnType}
     */
    getUserOperationGasPrice: () => Promise<Prettify<GetUserOperationGasPriceReturnType>>;
};
export declare function kernelAccountClientActions<entryPoint extends EntryPoint>({ middleware }: Middleware<entryPoint>): <TTransport extends Transport, TChain extends Chain | undefined = Chain | undefined, TSmartAccount extends KernelSmartAccount<entryPoint> | undefined = KernelSmartAccount<entryPoint> | undefined>(client: Client<TTransport, TChain, TSmartAccount>) => KernelAccountClientActions<entryPoint, TChain, TSmartAccount>;
//# sourceMappingURL=kernel.d.ts.map