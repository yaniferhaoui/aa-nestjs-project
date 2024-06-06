import type { KernelValidator } from "@zerodev/sdk/types";
import { type SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Chain, type Client, type Hex, type Transport } from "viem";
export interface WeightedECDSAValidatorConfig {
    threshold: number;
    signers: Array<{
        address: Address;
        weight: number;
    }>;
    delay?: number;
}
export declare const getValidatorAddress: (entryPointAddress: EntryPoint) => "0x8012D9ee59176Cb01a4aa80fCFE6f5E8bA58d4fb" | "0xeD89244160CfE273800B58b1B534031699dFeEEE";
export declare function createWeightedECDSAValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TSource extends string = "custom", TAddress extends Address = Address>(client: Client<TTransport, TChain, undefined>, { config, signers: _signers, entryPoint: entryPointAddress, validatorAddress }: {
    config?: WeightedECDSAValidatorConfig;
    signers: Array<SmartAccountSigner<TSource, TAddress>>;
    entryPoint: entryPoint;
    validatorAddress?: Address;
}): Promise<KernelValidator<entryPoint, "WeightedECDSAValidator">>;
export declare function getUpdateConfigCall<entryPoint extends EntryPoint>(entryPointAddress: entryPoint, newConfig: WeightedECDSAValidatorConfig): {
    to: Address;
    value: bigint;
    data: Hex;
};
export declare function getCurrentSigners<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { entryPoint: entryPointAddress, multiSigAccountAddress, validatorAddress }: {
    entryPoint: entryPoint;
    multiSigAccountAddress: Address;
    validatorAddress?: Address;
}): Promise<Array<{
    address: Address;
    weight: number;
}>>;
//# sourceMappingURL=toWeightedECDSAValidatorPlugin.d.ts.map