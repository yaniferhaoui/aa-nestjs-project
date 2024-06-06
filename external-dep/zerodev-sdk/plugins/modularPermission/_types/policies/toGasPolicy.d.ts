import type { EntryPoint } from "permissionless/types/entrypoint";
import type { GasPolicyParams, Policy } from "./types.js";
export declare function toGasPolicy<entryPoint extends EntryPoint>({ policyAddress, policyFlag, maxGasAllowedInWei, enforcePaymaster, paymasterAddress }: GasPolicyParams): Promise<Policy<entryPoint>>;
//# sourceMappingURL=toGasPolicy.d.ts.map