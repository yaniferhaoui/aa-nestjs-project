import { ENTRYPOINT_ADDRESS_V06, getEntryPointVersion } from "permissionless";
import { satisfies } from "semver";
import { concatHex, encodeFunctionData, erc20Abi, hexToSignature, isHex, pad, signatureToHex, zeroAddress } from "viem";
import { KernelImplToVersionMap, LATEST_KERNEL_VERSION } from "./constants.js";
export const getKernelVersion = (entryPointAddress, kernelImpl) => {
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    if (!kernelImpl || kernelImpl === zeroAddress)
        return LATEST_KERNEL_VERSION[entryPointVersion];
    for (const [addr, ver] of Object.entries(KernelImplToVersionMap)) {
        if (addr.toLowerCase() === kernelImpl.toLowerCase())
            return ver;
    }
    return "0.2.1";
};
export var KERNEL_FEATURES;
(function (KERNEL_FEATURES) {
    KERNEL_FEATURES["ERC1271_SIG_WRAPPER"] = "ERC1271_SIG_WRAPPER";
    KERNEL_FEATURES["ERC1271_WITH_VALIDATOR"] = "ERC1271_WITH_VALIDATOR";
    KERNEL_FEATURES["ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH"] = "ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH";
})(KERNEL_FEATURES || (KERNEL_FEATURES = {}));
const KERNEL_FEATURES_BY_VERSION = {
    [KERNEL_FEATURES.ERC1271_SIG_WRAPPER]: ">=0.2.3 || >=0.3.0-beta",
    [KERNEL_FEATURES.ERC1271_WITH_VALIDATOR]: ">=0.3.0-beta",
    [KERNEL_FEATURES.ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH]: ">=0.3.0-beta"
};
export const hasKernelFeature = (feature, version) => {
    if (!(feature in KERNEL_FEATURES_BY_VERSION)) {
        return false;
    }
    return satisfies(version, KERNEL_FEATURES_BY_VERSION[feature]);
};
export const getERC20PaymasterApproveCall = async (client, { gasToken, approveAmount }) => {
    const response = await client.request({
        method: "zd_pm_accounts",
        params: [
            {
                chainId: client.chain?.id,
                entryPointAddress: ENTRYPOINT_ADDRESS_V06
            }
        ]
    });
    return {
        to: gasToken,
        data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [response[0], approveAmount]
        }),
        value: 0n
    };
};
export const fixSignedData = (sig) => {
    let signature = sig;
    if (!isHex(signature)) {
        signature = `0x${signature}`;
        if (!isHex(signature)) {
            throw new Error(`Invalid signed data ${sig}`);
        }
    }
    let { r, s, v } = hexToSignature(signature);
    if (v === 0n || v === 1n)
        v += 27n;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const joined = signatureToHex({ r, s, v: v });
    return joined;
};
export const getExecMode = ({ callType, execType }) => {
    return concatHex([
        callType, // 1 byte
        execType, // 1 byte
        "0x00000000", // 4 bytes
        "0x00000000", // 4 bytes
        pad("0x00000000", { size: 22 })
    ]);
};
//# sourceMappingURL=utils.js.map