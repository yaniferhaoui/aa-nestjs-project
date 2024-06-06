import { type Abi, type Hex } from "viem";
import type { GeneratePermissionFromArgsParameters, PermissionCore } from "../types.js";
export declare const findMatchingPermissions: (callData: Hex, permissionsList?: PermissionCore[]) => PermissionCore | PermissionCore[] | undefined;
export declare function getPermissionFromABI<TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string>({ abi, args, functionName }: GeneratePermissionFromArgsParameters<TAbi, TFunctionName>): Pick<PermissionCore, "sig" | "rules">;
//# sourceMappingURL=merklePolicyUtils.d.ts.map