import { concatHex, pad } from "viem";
import { CALL_TYPE, EXEC_TYPE } from "../constants.js";
export const getExecMode = ({ callType, execType }) => {
    return concatHex([
        callType, // 1 byte
        execType, // 1 byte
        "0x00000000", // 4 bytes
        "0x00000000", // 4 bytes
        pad("0x00000000", { size: 22 })
    ]);
};
//# sourceMappingURL=getExecMode.js.map