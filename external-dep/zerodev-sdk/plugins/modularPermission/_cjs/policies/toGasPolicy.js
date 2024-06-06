"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGasPolicy = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../constants.js");
const constants_js_2 = require("../constants.js");
async function toGasPolicy({ policyAddress = constants_js_2.GAS_POLICY_CONTRACT, policyFlag = constants_js_1.PolicyFlags.FOR_ALL_VALIDATION, maxGasAllowedInWei, enforcePaymaster = false, paymasterAddress = viem_1.zeroAddress }) {
    return {
        getPolicyData: () => {
            return (0, viem_1.encodeAbiParameters)([
                { name: "maxGasAllowedInWei", type: "uint128" },
                { name: "enforcePaymaster", type: "bool" },
                { name: "paymasterAddress", type: "address" }
            ], [maxGasAllowedInWei, enforcePaymaster, paymasterAddress]);
        },
        getSignaturePolicyData: () => {
            return "0x";
        },
        getPolicyInfoInBytes: () => {
            return (0, viem_1.concatHex)([policyFlag, policyAddress]);
        },
        policyParams: {
            type: "gas",
            policyAddress,
            policyFlag,
            maxGasAllowedInWei,
            enforcePaymaster,
            paymasterAddress
        }
    };
}
exports.toGasPolicy = toGasPolicy;
//# sourceMappingURL=toGasPolicy.js.map