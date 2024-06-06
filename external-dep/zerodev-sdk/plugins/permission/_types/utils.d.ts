import type { EntryPoint } from "permissionless/types";
import type { PermissionAccountParams, PermissionPlugin } from "./types.js";
export declare function base64ToBytes(base64: string): Uint8Array;
export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function isPermissionValidatorPlugin<entryPoint extends EntryPoint>(plugin: any): plugin is PermissionPlugin<entryPoint>;
export declare const serializePermissionAccountParams: (params: PermissionAccountParams) => string;
export declare const deserializePermissionAccountParams: (params: string) => PermissionAccountParams;
//# sourceMappingURL=utils.d.ts.map