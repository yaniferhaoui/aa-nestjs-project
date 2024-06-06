import { KernelAccountAbi } from "@zerodev/sdk";
import { getEntryPointVersion, getUserOperationHash } from "permissionless";
import { concat, encodeAbiParameters, keccak256, pad, toHex } from "viem";
import { getChainId, readContract } from "viem/actions";
import { getAction } from "viem/utils";
import { ModularPermissionValidatorAbi } from "./abi/ModularPermissionValidatorAbi.js";
import { MAX_FLAG, MODULAR_PERMISSION_VALIDATOR_ADDRESS } from "./constants.js";
export async function createPermissionValidator(client, { signer, entryPoint: entryPointAddress, policies, validUntil, validAfter, validatorAddress = MODULAR_PERMISSION_VALIDATOR_ADDRESS }) {
    const chainId = await getChainId(client);
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const getNonces = async (kernelAccountAddress) => {
        const nonce = await getAction(client, readContract, "readContract")({
            abi: ModularPermissionValidatorAbi,
            address: validatorAddress,
            functionName: "nonces",
            args: [kernelAccountAddress]
        });
        return { lastNonce: nonce[0], revoked: nonce[1] };
    };
    const getEnableData = async (kernelAccountAddress) => {
        const nonce = kernelAccountAddress
            ? (await getNonces(kernelAccountAddress)).lastNonce + 1n
            : 0n;
        const enableData = concat([
            pad(toHex(nonce), { size: 16 }),
            MAX_FLAG,
            pad(toHex(validAfter ?? 0), { size: 6 }),
            pad(toHex(validUntil ?? 0), { size: 6 }),
            signer.signerContractAddress,
            encodeAbiParameters([
                { name: "policies", type: "bytes32[]" },
                { name: "signerData", type: "bytes" },
                { name: "policyData", type: "bytes[]" }
            ], [
                policies.map((policy) => policy.getPolicyInfoInBytes()),
                signer.getSignerData(),
                policies.map((policy) => policy.getPolicyData())
            ])
        ]);
        return enableData;
    };
    const getPermissionId = () => {
        const pIdData = encodeAbiParameters([
            { name: "flag", type: "bytes12" },
            { name: "signer", type: "address" },
            { name: "validAfter", type: "uint48" },
            { name: "validUntil", type: "uint48" },
            { name: "policies", type: "bytes32[]" },
            { name: "signerData", type: "bytes" },
            { name: "policyData", type: "bytes[]" }
        ], [
            MAX_FLAG,
            signer.signerContractAddress,
            validAfter ?? 0,
            validUntil ?? 0,
            policies.map((policy) => policy.getPolicyInfoInBytes()),
            signer.getSignerData(),
            policies.map((policy) => policy.getPolicyData())
        ]);
        return keccak256(pIdData);
    };
    return {
        ...signer.account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "ModularPermissionValidator",
        getEnableData,
        getIdentifier() {
            return validatorAddress;
        },
        signMessage: async ({ message }) => {
            return concat([
                getPermissionId(),
                await signer.account.signMessage({ message })
            ]);
        },
        signTypedData: async (typedData) => {
            return concat([
                getPermissionId(),
                await signer.account.signTypedData(typedData)
            ]);
        },
        signUserOperation: async (userOperation) => {
            const userOpHash = getUserOperationHash({
                userOperation: { ...userOperation, signature: "0x" },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await signer.account.signMessage({
                message: { raw: userOpHash }
            });
            return concat([
                getPermissionId(),
                ...policies.map((policy) => policy.getSignaturePolicyData(userOperation)),
                signature
            ]);
        },
        async getNonceKey(_accountAddress, customNonceKey) {
            if (customNonceKey) {
                return customNonceKey;
            }
            return 0n;
        },
        async getDummySignature(userOperation) {
            return concat([
                getPermissionId(),
                ...policies.map((policy) => policy.getSignaturePolicyData(userOperation)),
                signer.getDummySignature()
            ]);
        },
        getPluginSerializationParams: () => {
            return {
                validAfter,
                validUntil,
                policies
            };
        },
        isEnabled: async (kernelAccountAddress, selector) => {
            try {
                const execDetail = await getAction(client, readContract, "readContract")({
                    abi: KernelAccountAbi,
                    address: kernelAccountAddress,
                    functionName: "getExecution",
                    args: [selector]
                });
                const permission = await getAction(client, readContract, "readContract")({
                    abi: ModularPermissionValidatorAbi,
                    address: validatorAddress,
                    functionName: "permissions",
                    args: [getPermissionId(), kernelAccountAddress]
                });
                return (execDetail.validator.toLowerCase() ===
                    validatorAddress.toLowerCase() &&
                    permission[3] !==
                        "0x0000000000000000000000000000000000000000000000000000000000000000");
            }
            catch (error) {
                return false;
            }
        }
    };
}
//# sourceMappingURL=toModularPermissionValidatorPlugin.js.map