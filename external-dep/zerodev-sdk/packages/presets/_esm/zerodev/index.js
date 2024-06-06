import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk";
import { http, createPublicClient, isAddress } from "viem";
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
    return isAddress(value);
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isValidPaymasterType(value) {
    return value === "NONE" || value === "SPONSOR" || isERC20(value);
}
export async function createEcdsaKernelAccountClient({ chain, projectId, signer, provider, index, paymaster = "SPONSOR", entryPointAddress }) {
    const publicClient = createPublicClient({
        transport: http(getZeroDevBundlerRPC(projectId, provider))
    });
    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer,
        entryPoint: entryPointAddress
    });
    const account = await createKernelAccount(publicClient, {
        plugins: {
            sudo: ecdsaValidator
        },
        index,
        entryPoint: entryPointAddress
    });
    if (!isValidPaymasterType(paymaster)) {
        throw new Error("Invalid paymaster type");
    }
    const zerodevPaymaster = createZeroDevPaymasterClient({
        chain: chain,
        transport: http(getZeroDevPaymasterRPC(projectId, provider)),
        entryPoint: entryPointAddress
    });
    const kernelClient = createKernelAccountClient({
        account,
        chain,
        entryPoint: entryPointAddress,
        bundlerTransport: http(getZeroDevBundlerRPC(projectId, provider)),
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
//# sourceMappingURL=index.js.map