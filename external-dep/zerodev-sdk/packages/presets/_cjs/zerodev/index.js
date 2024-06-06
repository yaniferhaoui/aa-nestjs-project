"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEcdsaKernelAccountClient = void 0;
const ecdsa_validator_1 = require("@zerodev/ecdsa-validator");
const sdk_1 = require("@zerodev/sdk");
const viem_1 = require("viem");
const getZeroDevBundlerRPC = (projectId, provider) => {
    let rpc = `https://rpc.zerodev.app/api/v2/bundler/${projectId}`;
    if (provider) {
        rpc += `?bundlerProvider=${provider}`;
    }
    return rpc;
};
const getZeroDevPaymasterRPC = (projectId, provider) => {
    let rpc = `https://rpc.zerodev.app/api/v2/paymaster/${projectId}`;
    if (provider) {
        rpc += `?paymasterProvider=${provider}`;
    }
    return rpc;
};
function isERC20(value) {
    return (0, viem_1.isAddress)(value);
}
function isValidPaymasterType(value) {
    return value === "NONE" || value === "SPONSOR" || isERC20(value);
}
async function createEcdsaKernelAccountClient({ chain, projectId, signer, provider, index, paymaster = "SPONSOR", entryPointAddress }) {
    const publicClient = (0, viem_1.createPublicClient)({
        transport: (0, viem_1.http)(getZeroDevBundlerRPC(projectId, provider))
    });
    const ecdsaValidator = await (0, ecdsa_validator_1.signerToEcdsaValidator)(publicClient, {
        signer,
        entryPoint: entryPointAddress
    });
    const account = await (0, sdk_1.createKernelAccount)(publicClient, {
        plugins: {
            sudo: ecdsaValidator
        },
        index,
        entryPoint: entryPointAddress
    });
    if (!isValidPaymasterType(paymaster)) {
        throw new Error("Invalid paymaster type");
    }
    const zerodevPaymaster = (0, sdk_1.createZeroDevPaymasterClient)({
        chain: chain,
        transport: (0, viem_1.http)(getZeroDevPaymasterRPC(projectId, provider)),
        entryPoint: entryPointAddress
    });
    const kernelClient = (0, sdk_1.createKernelAccountClient)({
        account,
        chain,
        entryPoint: entryPointAddress,
        bundlerTransport: (0, viem_1.http)(getZeroDevBundlerRPC(projectId, provider)),
        middleware: paymaster !== "NONE"
            ? {
                sponsorUserOperation: async ({ userOperation }) => {
                    const _userOperation = userOperation;
                    if (isERC20(paymaster)) {
                        return zerodevPaymaster.sponsorUserOperation({
                            userOperation: _userOperation,
                            entryPoint: entryPointAddress,
                            gasToken: paymaster
                        });
                    }
                    return zerodevPaymaster.sponsorUserOperation({
                        userOperation: _userOperation,
                        entryPoint: entryPointAddress
                    });
                }
            }
            : undefined
    });
    return kernelClient;
}
exports.createEcdsaKernelAccountClient = createEcdsaKernelAccountClient;
//# sourceMappingURL=index.js.map