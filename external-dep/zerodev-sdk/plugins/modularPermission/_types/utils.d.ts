import type { EntryPoint } from "permissionless/types";
import type { ModularPermissionAccountParams, ModularPermissionPlugin } from "./types.js";
export declare function base64ToBytes(base64: string): Uint8Array;
export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function isModularPermissionValidatorPlugin<entryPoint extends EntryPoint>(plugin: any): plugin is ModularPermissionPlugin<entryPoint>;
export declare const serializeModularPermissionAccountParams: <entryPoint extends EntryPoint>(params: ModularPermissionAccountParams<entryPoint>) => string;
export declare const deserializeModularPermissionAccountParams: <entryPoint extends EntryPoint>(params: string) => ModularPermissionAccountParams<entryPoint>;
//# sourceMappingURL=utils.d.ts.map