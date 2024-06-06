import { EXEC_TYPE } from "../../../../../constants.js";
import { encodeExecuteBatchCall } from "../../ep0_7/encodeExecuteBatchCall.js";
import { encodeExecuteDelegateCall } from "../../ep0_7/encodeExecuteDelegateCall.js";
import { encodeExecuteSingleCall } from "../../ep0_7/encodeExecuteSingleCall.js";
export const encodeCallData = async (tx) => {
    if (Array.isArray(tx)) {
        if (tx.some((t) => t.callType === "delegatecall")) {
            throw new Error("Cannot batch delegatecall");
        }
        // Encode a batched call
        return encodeExecuteBatchCall(tx, {
            execType: EXEC_TYPE.DEFAULT
        });
    }
    // Default to `call`
    if (!tx.callType || tx.callType === "call") {
        return encodeExecuteSingleCall(tx, {
            execType: EXEC_TYPE.DEFAULT
        });
    }
    if (tx.callType === "delegatecall") {
        return encodeExecuteDelegateCall({ to: tx.to, data: tx.data }, {
            execType: EXEC_TYPE.DEFAULT
        });
    }
    throw new Error("Invalid call type");
};
//# sourceMappingURL=encodeCallData.js.map