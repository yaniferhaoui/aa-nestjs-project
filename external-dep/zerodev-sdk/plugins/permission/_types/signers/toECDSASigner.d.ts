import { type SmartAccountSigner } from "permissionless/accounts";
import type { Address } from "viem";
import type { ModularSigner, ModularSignerParams } from "../types.js";
export type ECDSAModularSignerParams<TSource extends string = "custom", TAddress extends Address = Address> = ModularSignerParams & {
    signer: SmartAccountSigner<TSource, TAddress>;
};
export declare function toECDSASigner<TSource extends string = "custom", TAddress extends Address = Address>({ signer, signerContractAddress }: ECDSAModularSignerParams<TSource, TAddress>): ModularSigner;
//# sourceMappingURL=toECDSASigner.d.ts.map