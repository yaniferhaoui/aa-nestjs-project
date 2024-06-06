import { encodeFunctionData } from "viem";
import { KernelExecuteAbi } from "../../abi/KernelAccountAbi.js";
export const encodeExecuteSingleCall = (args) => {
    return encodeFunctionData({
        abi: KernelExecuteAbi,
        functionName: "execute",
        args: [args.to, args.value, args.data, 0]
    });
};
//# sourceMappingURL=encodeExecuteSingleCall.js.map