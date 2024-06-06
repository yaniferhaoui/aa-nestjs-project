import type { Abi } from "viem";
import type { Policy, PolicyParams } from "../types.js";
import { type Permission } from "./types.js";
export type CallPolicyParams<TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string> = PolicyParams & {
    permissions?: Permission<TAbi, TFunctionName>[];
};
export declare function toCallPolicy<TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string>({ policyAddress, policyFlag, permissions }: CallPolicyParams<TAbi, TFunctionName>): Policy;
//# sourceMappingURL=toCallPolicy.d.ts.map