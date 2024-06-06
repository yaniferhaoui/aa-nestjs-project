import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Policy, SignaturePolicyParams } from "./types.js";
export declare function toSignaturePolicy<entryPoint extends EntryPoint>({ policyAddress, policyFlag, allowedRequestors }: SignaturePolicyParams): Promise<Policy<entryPoint>>;
//# sourceMappingURL=toSignaturePolicy.d.ts.map