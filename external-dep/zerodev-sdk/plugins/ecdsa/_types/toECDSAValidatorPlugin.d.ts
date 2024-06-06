import type { KernelValidator } from "@zerodev/sdk/types";
import { type SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Address, Chain, Client, Transport } from "viem";
export declare const getValidatorAddress: (entryPointAddress: EntryPoint) => "0xd9AB5096a832b9ce79914329DAEE236f8Eea0390" | "0x8104e3Ad430EA6d354d013A6789fDFc71E671c43";
export declare function signerToEcdsaValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TSource extends string = "custom", TAddress extends Address = Address>(client: Client<TTransport, TChain, undefined>, { signer, entryPoint: entryPointAddress, validatorAddress }: {
    signer: SmartAccountSigner<TSource, TAddress>;
    entryPoint: entryPoint;
    validatorAddress?: Address;
}): Promise<KernelValidator<entryPoint, "ECDSAValidator">>;
//# sourceMappingURL=toECDSAValidatorPlugin.d.ts.map