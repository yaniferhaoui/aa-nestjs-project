import type { ENTRYPOINT_ADDRESS_V06_TYPE, EntryPoint } from "permissionless/types/entrypoint";
import { type Address, type Hex, type PublicClient } from "viem";
export type GetKernelAddressFromECDSAParams<entryPoint extends EntryPoint> = {
    entryPointAddress: entryPoint;
    eoaAddress: Address;
    index: bigint;
    hookAddress?: entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? never : Address;
    hookData?: entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? never : Hex;
} & ({
    publicClient: PublicClient;
    initCodeHash?: never;
} | {
    publicClient?: never;
    initCodeHash: Hex;
});
export declare function getKernelAddressFromECDSA<entryPoint extends EntryPoint>(params: GetKernelAddressFromECDSAParams<entryPoint>): Promise<`0x${string}`>;
//# sourceMappingURL=getAddress.d.ts.map