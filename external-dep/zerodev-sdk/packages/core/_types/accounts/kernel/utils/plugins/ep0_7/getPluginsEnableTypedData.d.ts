import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type CustomSource } from "viem";
import type { Kernel2_0_plugins } from "../ep0_6/getPluginsEnableTypedData.js";
export declare const getPluginsEnableTypedData: <entryPoint extends EntryPoint = "0x0000000071727De22E5E9d8BAf0edAc6f37da032">({ accountAddress, chainId, kernelVersion, action, validator, validatorNonce }: {
    accountAddress: Address;
    chainId: number;
    kernelVersion: string;
    validatorNonce: number;
} & Kernel2_0_plugins<entryPoint>) => Promise<Parameters<CustomSource["signTypedData"]>[0]>;
//# sourceMappingURL=getPluginsEnableTypedData.d.ts.map