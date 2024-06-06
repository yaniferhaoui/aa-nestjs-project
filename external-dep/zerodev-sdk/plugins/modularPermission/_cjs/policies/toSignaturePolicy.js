"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSignaturePolicy = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../constants.js");
async function toSignaturePolicy({ policyAddress = constants_js_1.SIGNATURE_POLICY_CONTRACT, policyFlag = constants_js_1.PolicyFlags.NOT_FOR_VALIDATE_USEROP, allowedRequestors }) {
    return {
        getPolicyData: () => {
            return (0, viem_1.encodeAbiParameters)([{ name: "allowedSigners", type: "address[]" }], [allowedRequestors]);
        },
        getSignaturePolicyData: () => {
            return "0x";
        },
        getPolicyInfoInBytes: () => {
            return (0, viem_1.concatHex)([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "signature",
            policyAddress,
            policyFlag,
            allowedRequestors
        }
    };
}
exports.toSignaturePolicy = toSignaturePolicy;
//# sourceMappingURL=toSignaturePolicy.js.map