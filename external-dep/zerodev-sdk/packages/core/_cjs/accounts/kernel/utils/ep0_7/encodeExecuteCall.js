"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeExecuteCall = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../../../../constants.js");
const utils_js_1 = require("../../../../utils.js");
const KernelAccountAbi_js_1 = require("../../abi/kernel_v_3_0_0/KernelAccountAbi.js");
const encodeExecuteCall = (args, options) => {
    let calldata;
    if ("calldata" in args) {
        calldata = args.calldata;
    }
    else {
        calldata = (0, viem_1.concatHex)([
            args.to,
            options.callType !== constants_js_1.CALL_TYPE.DELEGATE_CALL
                ? (0, viem_1.toHex)(args.value, { size: 32 })
                : "0x",
            args.data
        ]);
    }
    return (0, viem_1.encodeFunctionData)({
        abi: KernelAccountAbi_js_1.KernelV3ExecuteAbi,
        functionName: "execute",
        args: [(0, utils_js_1.getExecMode)(options), calldata]
    });
};
exports.encodeExecuteCall = encodeExecuteCall;
//# sourceMappingURL=encodeExecuteCall.js.map