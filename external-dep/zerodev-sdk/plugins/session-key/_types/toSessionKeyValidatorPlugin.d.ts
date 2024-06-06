import { type Abi, type Address, type Chain, type Client, type Transport } from "viem";
import { type SmartAccountSigner } from "permissionless/accounts";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { SessionKeyData, SessionKeyPlugin } from "./types.js";
export declare enum Operation {
    Call = 0,
    DelegateCall = 1
}
export declare enum ParamOperator {
    EQUAL = 0,
    GREATER_THAN = 1,
    LESS_THAN = 2,
    GREATER_THAN_OR_EQUAL = 3,
    LESS_THAN_OR_EQUAL = 4,
    NOT_EQUAL = 5
}
export declare const anyPaymaster = "0x0000000000000000000000000000000000000001";
export declare function signerToSessionKeyValidator<entryPoint extends EntryPoint, TAbi extends Abi | readonly unknown[], TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TSource extends string = "custom", TAddress extends Address = Address, TFunctionName extends string | undefined = string>(client: Client<TTransport, TChain, undefined>, { signer, entryPoint: entryPointAddress, validatorData, validatorAddress }: {
    signer: SmartAccountSigner<TSource, TAddress>;
    validatorData?: SessionKeyData<TAbi, TFunctionName>;
    entryPoint: EntryPoint;
    validatorAddress?: Address;
}): Promise<SessionKeyPlugin<entryPoint>>;
//# sourceMappingURL=toSessionKeyValidatorPlugin.d.ts.map