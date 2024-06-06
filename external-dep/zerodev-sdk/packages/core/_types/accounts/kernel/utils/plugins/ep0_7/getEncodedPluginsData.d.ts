import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Hex } from "viem";
import type { Kernel2_0_plugins } from "../ep0_6/getPluginsEnableTypedData.js";
export declare const getEncodedPluginsData: <entryPoint extends EntryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789">({ accountAddress, enableSignature, userOpSignature, action, validator }: {
    accountAddress: Address;
    enableSignature: Hex;
    userOpSignature: Hex;
} & Kernel2_0_plugins<entryPoint>) => Promise<`0x${string}`>;
//# sourceMappingURL=getEncodedPluginsData.d.ts.map