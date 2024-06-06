import type { Address } from "viem";
import type { ModularSigner, ModularSignerParams } from "../types.js";
export type EmptyCosigningSignerParams = ModularSignerParams & {
    signerAddress: Address;
};
export declare function toEmptyCosigningSigner({ signerAddress, signerContractAddress }: EmptyCosigningSignerParams): ModularSigner;
//# sourceMappingURL=toEmptyCosigningSigner.d.ts.map