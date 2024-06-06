import type { EntryPointVersion } from "permissionless/types/entrypoint";
import type { Address, Hex } from "viem";
export declare const DUMMY_ECDSA_SIG = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
export declare const KernelImplToVersionMap: {
    [key: Address]: string;
};
export declare const TOKEN_ACTION = "0x2087C7FfD0d0DAE80a00EE74325aBF3449e0eaf1";
export declare const ONLY_ENTRYPOINT_HOOK_ADDRESS = "0xb230f0A1C7C95fa11001647383c8C7a8F316b900";
export declare const KERNEL_NAME = "Kernel";
export declare const LATEST_KERNEL_VERSION: {
    [key in EntryPointVersion]: string;
};
export declare const VALIDATOR_TYPE: {
    readonly SUDO: "0x00";
    readonly SECONDARY: "0x01";
    readonly PERMISSION: "0x02";
};
export declare enum VALIDATOR_MODE {
    DEFAULT = "0x00",
    ENABLE = "0x01"
}
export declare enum CALL_TYPE {
    SINGLE = "0x00",
    BATCH = "0x01",
    DELEGATE_CALL = "0xFF"
}
export declare enum EXEC_TYPE {
    DEFAULT = "0x00",
    TRY_EXEC = "0x01"
}
export declare const safeCreateCallAddress = "0x9b35Af71d77eaf8d7e40252370304687390A1A52";
export declare const KernelFactoryToInitCodeHashMap: {
    [key: Address]: Hex;
};
//# sourceMappingURL=constants.d.ts.map