import { type Abi, type Hex } from "viem";
import type { GeneratePermissionFromArgsParameters, PermissionCore } from "./types.js";
export declare function getPermissionFromABI<TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string>({ abi, args, functionName }: GeneratePermissionFromArgsParameters<TAbi, TFunctionName>): Pick<PermissionCore, "selector" | "rules">;
export declare const encodePermissionData: (permission: PermissionCore | PermissionCore[]) => Hex;
//# sourceMappingURL=callPolicyUtils.d.ts.map