import { concatHex, encodeAbiParameters } from "viem";
import { PolicyFlags, SIGNATURE_POLICY_CONTRACT } from "../constants.js";
export async function toSignaturePolicy({ policyAddress = SIGNATURE_POLICY_CONTRACT, policyFlag = PolicyFlags.NOT_FOR_VALIDATE_USEROP, allowedRequestors }) {
    return {
        getPolicyData: () => {
            return encodeAbiParameters([{ name: "allowedSigners", type: "address[]" }], [allowedRequestors]);
        },
        getSignaturePolicyData: () => {
            return "0x";
        },
        getPolicyInfoInBytes: () => {
            return concatHex([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "signature",
            policyAddress,
            policyFlag,
            allowedRequestors
        }
    };
}
//# sourceMappingURL=toSignaturePolicy.js.map