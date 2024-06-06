import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Hex } from "viem";
import type { ZeroDevPaymasterClient } from "./clients/paymasterClient.js";
import { type CALL_TYPE, type EXEC_TYPE } from "./constants.js";
export declare const getKernelVersion: <entryPoint extends EntryPoint>(entryPointAddress: entryPoint, kernelImpl?: Address) => string;
export declare enum KERNEL_FEATURES {
    ERC1271_SIG_WRAPPER = "ERC1271_SIG_WRAPPER",
    ERC1271_WITH_VALIDATOR = "ERC1271_WITH_VALIDATOR",
    ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH = "ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH"
}
export declare const hasKernelFeature: (feature: KERNEL_FEATURES, version: string) => boolean;
export declare const getERC20PaymasterApproveCall: <entryPoint extends EntryPoint>(client: ZeroDevPaymasterClient<entryPoint>, { gasToken, approveAmount }: {
    gasToken: Address;
    approveAmount: bigint;
}) => Promise<{
    to: Address;
    value: bigint;
    data: Hex;
}>;
export declare const fixSignedData: (sig: Hex) => Hex;
export declare const getExecMode: ({ callType, execType }: {
    callType: CALL_TYPE;
    execType: EXEC_TYPE;
}) => Hex;
//# sourceMappingURL=utils.d.ts.map