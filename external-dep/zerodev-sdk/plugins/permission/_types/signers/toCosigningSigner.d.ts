import { type SmartAccountSigner } from "permissionless/accounts";
import type { Address } from "viem";
import type { ModularSigner, ModularSignerParams } from "../types.js";
export type CosigningModularSignerParams<TSource extends string = "custom", TAddress extends Address = Address> = ModularSignerParams & {
    signer: SmartAccountSigner<TSource, TAddress>;
};
export declare function toCosigningSigner<TSource extends string = "custom", TAddress extends Address = Address>({ signer, signerContractAddress }: CosigningModularSignerParams<TSource, TAddress>): ModularSigner;
//# sourceMappingURL=toCosigningSigner.d.ts.map