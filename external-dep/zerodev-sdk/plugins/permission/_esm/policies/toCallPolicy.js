import { concatHex, pad } from "viem";
import { PolicyFlags } from "../constants.js";
import { CALL_POLICY_CONTRACT } from "../constants.js";
import { encodePermissionData, getPermissionFromABI } from "./callPolicyUtils.js";
import { CallType } from "./types.js";
export function toCallPolicy({ policyAddress = CALL_POLICY_CONTRACT, policyFlag = PolicyFlags.FOR_ALL_VALIDATION, permissions = [] }) {
    const generatedPermissionParams = permissions?.map((perm) => getPermissionFromABI({
        abi: perm.abi,
        functionName: perm.functionName,
        args: perm.args
    }));
    permissions =
        permissions?.map((perm, index) => ({
            ...perm,
            callType: perm.callType ?? CallType.CALL,
            selector: perm.selector ??
                generatedPermissionParams?.[index]?.selector ??
                pad("0x", { size: 4 }),
            valueLimit: perm.valueLimit ?? 0n,
            rules: perm.rules ?? generatedPermissionParams?.[index]?.rules ?? []
        })) ?? [];
    const encodedPermissionData = encodePermissionData(permissions);
    return {
        getPolicyData: () => {
            return encodedPermissionData;
        },
        getPolicyInfoInBytes: () => {
            return concatHex([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "call",
            policyAddress,
            policyFlag,
            permissions
        }
    };
}
//# sourceMappingURL=toCallPolicy.js.map