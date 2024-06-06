import { concatHex, encodeFunctionData, toHex } from "viem";
import { CALL_TYPE } from "../../../../constants.js";
import { getExecMode } from "../../../../utils.js";
import { KernelV3ExecuteAbi } from "../../abi/kernel_v_3_0_0/KernelAccountAbi.js";
export const encodeExecuteCall = (args, options) => {
    let calldata;
    if ("calldata" in args) {
        calldata = args.calldata;
    }
    else {
        calldata = concatHex([
            args.to,
            options.callType !== CALL_TYPE.DELEGATE_CALL
                ? toHex(args.value, { size: 32 })
                : "0x", // No value if delegate call
            args.data
        ]);
    }
    return encodeFunctionData({
        abi: KernelV3ExecuteAbi,
        functionName: "execute",
        args: [getExecMode(options), calldata]
    });
};
//# sourceMappingURL=encodeExecuteCall.js.map