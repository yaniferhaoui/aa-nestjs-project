import { concatHex } from "viem";
import { PolicyFlags, SUDO_POLICY_CONTRACT } from "../constants.js";
export async function toSudoPolicy({ policyAddress = SUDO_POLICY_CONTRACT, policyFlag = PolicyFlags.FOR_ALL_VALIDATION }) {
    return {
        getPolicyData: () => {
            return "0x";
        },
        getSignaturePolicyData: () => {
            return "0x";
        },
        getPolicyInfoInBytes: () => {
            return concatHex([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "sudo",
            policyAddress,
            policyFlag
        }
    };
}
//# sourceMappingURL=toSudoPolicy.js.map