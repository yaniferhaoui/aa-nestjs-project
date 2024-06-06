import type { ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/types/entrypoint";
import { type Abi, type Hex } from "viem";
import type { GeneratePermissionFromArgsParameters, PermissionCore, SessionKeyAccountParams, SessionKeyPlugin } from "./types.js";
export declare function getPermissionFromABI<TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = string>({ abi, args, functionName }: GeneratePermissionFromArgsParameters<TAbi, TFunctionName>): Pick<PermissionCore, "sig" | "rules">;
export declare const fixSignedData: (sig: Hex) => Hex;
export declare const encodePermissionData: (permission: PermissionCore | PermissionCore[], merkleProof?: string[] | string[][]) => Hex;
export declare function base64ToBytes(base64: string): Uint8Array;
export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function isSessionKeyValidatorPlugin<entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE>(plugin: any): plugin is SessionKeyPlugin<entryPoint>;
export declare const serializeSessionKeyAccountParams: (params: SessionKeyAccountParams) => string;
export declare const deserializeSessionKeyAccountParams: (params: string) => SessionKeyAccountParams;
export declare const findMatchingPermissions: (callData: Hex, permissionsList?: PermissionCore[]) => PermissionCore | PermissionCore[] | undefined;
//# sourceMappingURL=utils.d.ts.map