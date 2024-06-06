import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Policy, SudoPolicyParams } from "./types.js";
export declare function toSudoPolicy<entryPoint extends EntryPoint>({ policyAddress, policyFlag }: SudoPolicyParams): Promise<Policy<entryPoint>>;
//# sourceMappingURL=toSudoPolicy.d.ts.map