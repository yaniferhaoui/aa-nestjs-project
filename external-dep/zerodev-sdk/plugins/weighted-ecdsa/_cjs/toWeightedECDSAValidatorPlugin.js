"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSigners = exports.getUpdateConfigCall = exports.createWeightedECDSAValidator = exports.getValidatorAddress = void 0;
const sdk_1 = require("@zerodev/sdk");
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const abi_js_1 = require("./abi.js");
const index_js_1 = require("./index.js");
const sortByAddress = (a, b) => {
    return a.address.toLowerCase() < b.address.toLowerCase() ? 1 : -1;
};
const getValidatorAddress = (entryPointAddress) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    return entryPointVersion === "v0.6"
        ? index_js_1.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V06
        : index_js_1.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V07;
};
exports.getValidatorAddress = getValidatorAddress;
async function createWeightedECDSAValidator(client, { config, signers: _signers, entryPoint: entryPointAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? (0, exports.getValidatorAddress)(entryPointAddress);
    if (!validatorAddress) {
        throw new Error("Validator address not provided");
    }
    if (config) {
        let sum = 0;
        for (const signer of config.signers) {
            sum += signer.weight;
        }
        if (sum < config.threshold) {
            throw new Error(`Sum of weights (${sum}) is less than threshold (${config.threshold})`);
        }
    }
    const configSigners = config ? [...config.signers].sort(sortByAddress) : [];
    const signers = _signers.sort(sortByAddress);
    const chainId = await (0, actions_1.getChainId)(client);
    const account = (0, accounts_2.toAccount)({
        address: signers[0].address,
        async signMessage({ message }) {
            let signatures = "";
            for (const signer of signers) {
                const signature = await signer.signMessage({
                    message
                });
                signatures += signature.startsWith("0x")
                    ? signature.substring(2)
                    : signature;
            }
            return `0x${signatures}`;
        },
        async signTransaction(_, __) {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            let signatures = "";
            for (const signer of signers) {
                const signature = await signer.signTypedData(typedData);
                signatures += signature.startsWith("0x")
                    ? signature.substring(2)
                    : signature;
            }
            return `0x${signatures}`;
        }
    });
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "WeightedECDSAValidator",
        getIdentifier: () => validatorAddress ?? (0, exports.getValidatorAddress)(entryPointAddress),
        async getEnableData() {
            if (!config)
                return "0x";
            return (0, viem_1.encodeAbiParameters)([
                { name: "_guardians", type: "address[]" },
                { name: "_weights", type: "uint24[]" },
                { name: "_threshold", type: "uint24" },
                { name: "_delay", type: "uint48" }
            ], [
                configSigners.map((signer) => signer.address),
                configSigners.map((signer) => signer.weight),
                config.threshold,
                config.delay || 0
            ]);
        },
        async getNonceKey(_accountAddress, customNonceKey) {
            if (customNonceKey) {
                return customNonceKey;
            }
            return 0n;
        },
        async signUserOperation(userOperation) {
            const callDataAndNonceHash = (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address, bytes, uint256"), [
                userOperation.sender,
                userOperation.callData,
                userOperation.nonce
            ]));
            let signatures = "";
            for (let i = 0; i < signers.length - 1; i++) {
                const signer = signers[i];
                const signature = await signer.signTypedData({
                    domain: {
                        name: "WeightedECDSAValidator",
                        version: "0.0.3",
                        chainId,
                        verifyingContract: validatorAddress
                    },
                    types: {
                        Approve: [
                            { name: "callDataAndNonceHash", type: "bytes32" }
                        ]
                    },
                    primaryType: "Approve",
                    message: {
                        callDataAndNonceHash
                    }
                });
                signatures += signature.startsWith("0x")
                    ? signature.substring(2)
                    : signature;
            }
            const userOpHash = (0, permissionless_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const lastSignature = await signers[signers.length - 1].signMessage({
                message: { raw: userOpHash }
            });
            signatures += lastSignature.startsWith("0x")
                ? lastSignature.substring(2)
                : lastSignature;
            return `0x${signatures}`;
        },
        async getDummySignature(userOperation) {
            const callDataAndNonceHash = (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address, bytes, uint256"), [
                userOperation.sender,
                userOperation.callData,
                userOperation.nonce
            ]));
            let signatures = "";
            for (let i = 0; i < signers.length - 1; i++) {
                const signer = signers[i];
                const signature = await signer.signTypedData({
                    domain: {
                        name: "WeightedECDSAValidator",
                        version: "0.0.3",
                        chainId,
                        verifyingContract: validatorAddress
                    },
                    types: {
                        Approve: [
                            { name: "callDataAndNonceHash", type: "bytes32" }
                        ]
                    },
                    primaryType: "Approve",
                    message: {
                        callDataAndNonceHash
                    }
                });
                signatures += signature.startsWith("0x")
                    ? signature.substring(2)
                    : signature;
            }
            const signature = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
            signatures += signature.startsWith("0x")
                ? signature.substring(2)
                : signature;
            return `0x${signatures}`;
        },
        async isEnabled(kernelAccountAddress, selector) {
            try {
                const execDetail = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
                    abi: sdk_1.KernelAccountAbi,
                    address: kernelAccountAddress,
                    functionName: "getExecution",
                    args: [selector]
                });
                return (execDetail.validator.toLowerCase() ===
                    validatorAddress?.toLowerCase());
            }
            catch (error) {
                return false;
            }
        }
    };
}
exports.createWeightedECDSAValidator = createWeightedECDSAValidator;
function getUpdateConfigCall(entryPointAddress, newConfig) {
    const signers = [...newConfig.signers].sort(sortByAddress);
    const validatorAddress = (0, exports.getValidatorAddress)(entryPointAddress);
    return {
        to: validatorAddress,
        value: 0n,
        data: (0, viem_1.encodeFunctionData)({
            abi: abi_js_1.WeightedValidatorAbi,
            functionName: "renew",
            args: [
                signers.map((signer) => signer.address) ?? [],
                signers.map((signer) => signer.weight) ?? [],
                newConfig.threshold,
                newConfig.delay || 0
            ]
        })
    };
}
exports.getUpdateConfigCall = getUpdateConfigCall;
async function getCurrentSigners(client, { entryPoint: entryPointAddress, multiSigAccountAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? (0, exports.getValidatorAddress)(entryPointAddress);
    if (!validatorAddress) {
        throw new Error("Validator address not provided");
    }
    const signers = [];
    let nextGuardian;
    const weightedStorage = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
        abi: abi_js_1.WeightedValidatorAbi,
        address: validatorAddress,
        functionName: "weightedStorage",
        args: [multiSigAccountAddress]
    });
    nextGuardian = weightedStorage[3];
    while (nextGuardian !== "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF") {
        const guardianStorage = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
            abi: abi_js_1.WeightedValidatorAbi,
            address: validatorAddress,
            functionName: "guardian",
            args: [nextGuardian, multiSigAccountAddress]
        });
        const guardianWeight = guardianStorage[0];
        signers.push({ address: nextGuardian, weight: guardianWeight });
        nextGuardian = guardianStorage[1];
    }
    return signers;
}
exports.getCurrentSigners = getCurrentSigners;
//# sourceMappingURL=toWeightedECDSAValidatorPlugin.js.map