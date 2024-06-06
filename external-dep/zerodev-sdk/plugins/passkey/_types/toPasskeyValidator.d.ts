import type { KernelValidator } from "@zerodev/sdk/types";
import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Chain, type Client, type Transport } from "viem";
export declare function createPasskeyValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { passkeyName, passkeyServerUrl, entryPoint: entryPointAddress, validatorAddress }: {
    passkeyName: string;
    passkeyServerUrl: string;
    entryPoint: entryPoint;
    validatorAddress?: Address;
}): Promise<KernelValidator<entryPoint, "WebAuthnValidator"> & {
    getSerializedData: () => string;
}>;
export declare function getPasskeyValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { passkeyServerUrl, entryPoint: entryPointAddress, validatorAddress }: {
    passkeyServerUrl: string;
    entryPoint: entryPoint;
    validatorAddress?: Address;
}): Promise<KernelValidator<entryPoint, "WebAuthnValidator"> & {
    getSerializedData: () => string;
}>;
export declare function deserializePasskeyValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { serializedData, entryPoint: entryPointAddress }: {
    serializedData: string;
    entryPoint: entryPoint;
}): Promise<KernelValidator<entryPoint, "WebAuthnValidator"> & {
    getSerializedData: () => string;
}>;
//# sourceMappingURL=toPasskeyValidator.d.ts.map