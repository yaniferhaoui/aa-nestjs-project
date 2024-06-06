"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCallData = void 0;
const constants_js_1 = require("../../../../../constants.js");
const encodeExecuteBatchCall_js_1 = require("../../ep0_7/encodeExecuteBatchCall.js");
const encodeExecuteDelegateCall_js_1 = require("../../ep0_7/encodeExecuteDelegateCall.js");
const encodeExecuteSingleCall_js_1 = require("../../ep0_7/encodeExecuteSingleCall.js");
const encodeCallData = async (tx) => {
    if (Array.isArray(tx)) {
        if (tx.some((t) => t.callType === "delegatecall")) {
            throw new Error("Cannot batch delegatecall");
        }
        return (0, encodeExecuteBatchCall_js_1.encodeExecuteBatchCall)(tx, {
            execType: constants_js_1.EXEC_TYPE.DEFAULT
        });
    }
    if (!tx.callType || tx.callType === "call") {
        return (0, encodeExecuteSingleCall_js_1.encodeExecuteSingleCall)(tx, {
            execType: constants_js_1.EXEC_TYPE.DEFAULT
        });
    }
    if (tx.callType === "delegatecall") {
        return (0, encodeExecuteDelegateCall_js_1.encodeExecuteDelegateCall)({ to: tx.to, data: tx.data }, {
            execType: constants_js_1.EXEC_TYPE.DEFAULT
        });
    }
    throw new Error("Invalid call type");
};
exports.encodeCallData = encodeCallData;
//# sourceMappingURL=encodeCallData.js.map