import { encodeAbiParameters, keccak256, stringToHex } from "viem";
export const hashKernelMessageHashWrapper = (messageHash) => {
    return keccak256(encodeAbiParameters([{ type: "bytes32" }, { type: "bytes32" }], [keccak256(stringToHex("Kernel(bytes32 hash)")), messageHash]));
};
//# sourceMappingURL=hashKernelSignatureWrapper.js.map