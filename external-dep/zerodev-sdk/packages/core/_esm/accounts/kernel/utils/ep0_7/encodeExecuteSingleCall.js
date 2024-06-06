import { CALL_TYPE } from "../../../../constants.js";
import { encodeExecuteCall } from "./encodeExecuteCall.js";
export const encodeExecuteSingleCall = (args, options) => {
    return encodeExecuteCall(args, {
        callType: CALL_TYPE.SINGLE,
        execType: options.execType
    });
};
//# sourceMappingURL=encodeExecuteSingleCall.js.map