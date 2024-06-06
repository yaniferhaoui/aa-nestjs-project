import type { KernelAccountClient, KernelSmartAccount } from "@zerodev/sdk";
import type { SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types";
import type { Address, Chain, HttpTransport } from "viem";
export type Provider = "STACKUP" | "PIMLICO" | "ALCHEMY" | "GELATO";
export type ERC20Paymaster = Address;
export type PaymasterType = "NONE" | "SPONSOR" | ERC20Paymaster;
export declare function createEcdsaKernelAccountClient<entryPoint extends EntryPoint, TChain extends Chain | undefined = Chain | undefined, TSource extends string = "custom", TAddress extends Address = Address>({ chain, projectId, signer, provider, index, paymaster, entryPointAddress }: {
    chain: TChain;
    projectId: string;
    signer: SmartAccountSigner<TSource, TAddress>;
    paymaster: PaymasterType;
    entryPointAddress: entryPoint;
    provider?: Provider;
    index?: bigint;
}): Promise<KernelAccountClient<entryPoint, HttpTransport, TChain, KernelSmartAccount<entryPoint, HttpTransport, TChain>>>;
//# sourceMappingURL=index.d.ts.map