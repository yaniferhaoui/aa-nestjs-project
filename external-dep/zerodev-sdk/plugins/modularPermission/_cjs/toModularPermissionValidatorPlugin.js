"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermissionValidator = void 0;
const sdk_1 = require("@zerodev/sdk");
const permissionless_1 = require("permissionless");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const ModularPermissionValidatorAbi_js_1 = require("./abi/ModularPermissionValidatorAbi.js");
const constants_js_1 = require("./constants.js");
async function createPermissionValidator(client, { signer, entryPoint: entryPointAddress, policies, validUntil, validAfter, validatorAddress = constants_js_1.MODULAR_PERMISSION_VALIDATOR_ADDRESS }) {
    const chainId = await (0, actions_1.getChainId)(client);
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const getNonces = async (kernelAccountAddress) => {
        const nonce = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
            abi: ModularPermissionValidatorAbi_js_1.ModularPermissionValidatorAbi,
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
        const enableData = (0, viem_1.concat)([
            (0, viem_1.pad)((0, viem_1.toHex)(nonce), { size: 16 }),
            constants_js_1.MAX_FLAG,
            (0, viem_1.pad)((0, viem_1.toHex)(validAfter ?? 0), { size: 6 }),
            (0, viem_1.pad)((0, viem_1.toHex)(validUntil ?? 0), { size: 6 }),
            signer.signerContractAddress,
            (0, viem_1.encodeAbiParameters)([
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
        const pIdData = (0, viem_1.encodeAbiParameters)([
            { name: "flag", type: "bytes12" },
            { name: "signer", type: "address" },
            { name: "validAfter", type: "uint48" },
            { name: "validUntil", type: "uint48" },
            { name: "policies", type: "bytes32[]" },
            { name: "signerData", type: "bytes" },
            { name: "policyData", type: "bytes[]" }
        ], [
            constants_js_1.MAX_FLAG,
            signer.signerContractAddress,
            validAfter ?? 0,
            validUntil ?? 0,
            policies.map((policy) => policy.getPolicyInfoInBytes()),
            signer.getSignerData(),
            policies.map((policy) => policy.getPolicyData())
        ]);
        return (0, viem_1.keccak256)(pIdData);
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
            return (0, viem_1.concat)([
                getPermissionId(),
                await signer.account.signMessage({ message })
            ]);
        },
        signTypedData: async (typedData) => {
            return (0, viem_1.concat)([
                getPermissionId(),
                await signer.account.signTypedData(typedData)
            ]);
        },
        signUserOperation: async (userOperation) => {
            const userOpHash = (0, permissionless_1.getUserOperationHash)({
                userOperation: { ...userOperation, signature: "0x" },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await signer.account.signMessage({
                message: { raw: userOpHash }
            });
            return (0, viem_1.concat)([
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
            return (0, viem_1.concat)([
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
                const execDetail = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
                    abi: sdk_1.KernelAccountAbi,
                    address: kernelAccountAddress,
                    functionName: "getExecution",
                    args: [selector]
                });
                const permission = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
                    abi: ModularPermissionValidatorAbi_js_1.ModularPermissionValidatorAbi,
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
exports.createPermissionValidator = createPermissionValidator;
//# sourceMappingURL=toModularPermissionValidatorPlugin.js.map