import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Abi, type Hex } from "viem";
import type { PermissionCore } from "../types.js";
import type { MerklePolicyParams, Policy } from "./types.js";
export declare enum ParamOperator {
    EQUAL = 0,
    GREATER_THAN = 1,
    LESS_THAN = 2,
    GREATER_THAN_OR_EQUAL = 3,
    LESS_THAN_OR_EQUAL = 4,
    NOT_EQUAL = 5
}
export declare enum Operation {
    Call = 0,
    DelegateCall = 1
}
export declare function toMerklePolicy<entryPoint extends EntryPoint, TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string>({ policyAddress, policyFlag, permissions }: MerklePolicyParams<TAbi, TFunctionName>): Promise<Policy<entryPoint>>;
export declare const encodePermissionData: (permission: PermissionCore | PermissionCore[], merkleProof?: string[] | string[][]) => Hex;
//# sourceMappingURL=toMerklePolicy.d.ts.map