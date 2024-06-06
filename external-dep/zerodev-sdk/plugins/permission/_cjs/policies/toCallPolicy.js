"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCallPolicy = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../constants.js");
const constants_js_2 = require("../constants.js");
const callPolicyUtils_js_1 = require("./callPolicyUtils.js");
const types_js_1 = require("./types.js");
function toCallPolicy({ policyAddress = constants_js_2.CALL_POLICY_CONTRACT, policyFlag = constants_js_1.PolicyFlags.FOR_ALL_VALIDATION, permissions = [] }) {
    const generatedPermissionParams = permissions?.map((perm) => (0, callPolicyUtils_js_1.getPermissionFromABI)({
        abi: perm.abi,
        functionName: perm.functionName,
        args: perm.args
    }));
    permissions =
        permissions?.map((perm, index) => ({
            ...perm,
            callType: perm.callType ?? types_js_1.CallType.CALL,
            selector: perm.selector ??
                generatedPermissionParams?.[index]?.selector ??
                (0, viem_1.pad)("0x", { size: 4 }),
            valueLimit: perm.valueLimit ?? 0n,
            rules: perm.rules ?? generatedPermissionParams?.[index]?.rules ?? []
        })) ?? [];
    const encodedPermissionData = (0, callPolicyUtils_js_1.encodePermissionData)(permissions);
    return {
        getPolicyData: () => {
            return encodedPermissionData;
        },
        getPolicyInfoInBytes: () => {
            return (0, viem_1.concatHex)([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "call",
            policyAddress,
            policyFlag,
            permissions
        }
    };
}
exports.toCallPolicy = toCallPolicy;
//# sourceMappingURL=toCallPolicy.js.map