"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecMode = exports.fixSignedData = exports.getERC20PaymasterApproveCall = exports.hasKernelFeature = exports.KERNEL_FEATURES = exports.getKernelVersion = void 0;
const permissionless_1 = require("permissionless");
const semver_1 = require("semver");
const viem_1 = require("viem");
const constants_js_1 = require("./constants.js");
const getKernelVersion = (entryPointAddress, kernelImpl) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (!kernelImpl || kernelImpl === viem_1.zeroAddress)
        return constants_js_1.LATEST_KERNEL_VERSION[entryPointVersion];
    for (const [addr, ver] of Object.entries(constants_js_1.KernelImplToVersionMap)) {
        if (addr.toLowerCase() === kernelImpl.toLowerCase())
            return ver;
    }
    return "0.2.1";
};
exports.getKernelVersion = getKernelVersion;
var KERNEL_FEATURES;
(function (KERNEL_FEATURES) {
    KERNEL_FEATURES["ERC1271_SIG_WRAPPER"] = "ERC1271_SIG_WRAPPER";
    KERNEL_FEATURES["ERC1271_WITH_VALIDATOR"] = "ERC1271_WITH_VALIDATOR";
    KERNEL_FEATURES["ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH"] = "ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH";
})(KERNEL_FEATURES || (exports.KERNEL_FEATURES = KERNEL_FEATURES = {}));
const KERNEL_FEATURES_BY_VERSION = {
    [KERNEL_FEATURES.ERC1271_SIG_WRAPPER]: ">=0.2.3 || >=0.3.0-beta",
    [KERNEL_FEATURES.ERC1271_WITH_VALIDATOR]: ">=0.3.0-beta",
    [KERNEL_FEATURES.ERC1271_SIG_WRAPPER_WITH_WRAPPED_HASH]: ">=0.3.0-beta"
};
const hasKernelFeature = (feature, version) => {
    if (!(feature in KERNEL_FEATURES_BY_VERSION)) {
        return false;
    }
    return (0, semver_1.satisfies)(version, KERNEL_FEATURES_BY_VERSION[feature]);
};
exports.hasKernelFeature = hasKernelFeature;
const getERC20PaymasterApproveCall = async (client, { gasToken, approveAmount }) => {
    const response = await client.request({
        method: "zd_pm_accounts",
        params: [
            {
                chainId: client.chain?.id,
                entryPointAddress: permissionless_1.ENTRYPOINT_ADDRESS_V06
            }
        ]
    });
    return {
        to: gasToken,
        data: (0, viem_1.encodeFunctionData)({
            abi: viem_1.erc20Abi,
            functionName: "approve",
            args: [response[0], approveAmount]
        }),
        value: 0n
    };
};
exports.getERC20PaymasterApproveCall = getERC20PaymasterApproveCall;
const fixSignedData = (sig) => {
    let signature = sig;
    if (!(0, viem_1.isHex)(signature)) {
        signature = `0x${signature}`;
        if (!(0, viem_1.isHex)(signature)) {
            throw new Error(`Invalid signed data ${sig}`);
        }
    }
    let { r, s, v } = (0, viem_1.hexToSignature)(signature);
    if (v === 0n || v === 1n)
        v += 27n;
    const joined = (0, viem_1.signatureToHex)({ r, s, v: v });
    return joined;
};
exports.fixSignedData = fixSignedData;
const getExecMode = ({ callType, execType }) => {
    return (0, viem_1.concatHex)([
        callType,
        execType,
        "0x00000000",
        "0x00000000",
        (0, viem_1.pad)("0x00000000", { size: 22 })
    ]);
};
exports.getExecMode = getExecMode;
//# sourceMappingURL=utils.js.map