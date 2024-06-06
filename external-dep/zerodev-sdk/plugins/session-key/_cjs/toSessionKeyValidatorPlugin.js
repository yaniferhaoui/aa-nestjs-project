"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerToSessionKeyValidator = exports.anyPaymaster = exports.ParamOperator = exports.Operation = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const SessionKeyValidatorAbi_js_1 = require("./abi/SessionKeyValidatorAbi.js");
const sdk_1 = require("@zerodev/sdk");
const sdk_2 = require("@zerodev/sdk");
const merkletreejs_1 = require("merkletreejs");
const permissionless_1 = require("permissionless");
const accounts_2 = require("permissionless/accounts");
const index_js_1 = require("./index.js");
const utils_js_1 = require("./utils.js");
var Operation;
(function (Operation) {
    Operation[Operation["Call"] = 0] = "Call";
    Operation[Operation["DelegateCall"] = 1] = "DelegateCall";
})(Operation || (exports.Operation = Operation = {}));
var ParamOperator;
(function (ParamOperator) {
    ParamOperator[ParamOperator["EQUAL"] = 0] = "EQUAL";
    ParamOperator[ParamOperator["GREATER_THAN"] = 1] = "GREATER_THAN";
    ParamOperator[ParamOperator["LESS_THAN"] = 2] = "LESS_THAN";
    ParamOperator[ParamOperator["GREATER_THAN_OR_EQUAL"] = 3] = "GREATER_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["LESS_THAN_OR_EQUAL"] = 4] = "LESS_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["NOT_EQUAL"] = 5] = "NOT_EQUAL";
})(ParamOperator || (exports.ParamOperator = ParamOperator = {}));
exports.anyPaymaster = "0x0000000000000000000000000000000000000001";
async function signerToSessionKeyValidator(client, { signer, entryPoint: entryPointAddress, validatorData, validatorAddress = index_js_1.SESSION_KEY_VALIDATOR_ADDRESS }) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const sessionKeyData = {
        ...validatorData,
        validAfter: validatorData?.validAfter ?? 0,
        validUntil: validatorData?.validUntil ?? 0,
        paymaster: validatorData?.paymaster ?? viem_1.zeroAddress
    };
    const generatedPermissionParams = validatorData?.permissions?.map((perm) => (0, utils_js_1.getPermissionFromABI)({
        abi: perm.abi,
        functionName: perm.functionName,
        args: perm.args
    }));
    sessionKeyData.permissions =
        sessionKeyData.permissions?.map((perm, index) => ({
            ...perm,
            valueLimit: perm.valueLimit ?? 0n,
            sig: perm.sig ??
                generatedPermissionParams?.[index]?.sig ??
                (0, viem_1.pad)("0x", { size: 4 }),
            rules: perm.rules ?? generatedPermissionParams?.[index]?.rules ?? [],
            index,
            executionRule: perm.executionRule ?? {
                validAfter: 0,
                interval: 0,
                runs: 0
            },
            operation: perm.operation ?? Operation.Call
        })) ?? [];
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new accounts_2.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const [chainId] = await Promise.all([(0, actions_1.getChainId)(client)]);
    const account = (0, accounts_1.toAccount)({
        address: viemSigner.address,
        async signMessage({ message }) {
            return (0, actions_1.signMessage)(client, { account: viemSigner, message });
        },
        async signTransaction(_, __) {
            throw new accounts_2.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return (0, actions_1.signTypedData)(client, {
                account: viemSigner,
                ...typedData
            });
        }
    });
    const encodedPermissionData = sessionKeyData.permissions.map((permission) => (0, utils_js_1.encodePermissionData)(permission));
    if (encodedPermissionData.length && encodedPermissionData.length === 1)
        encodedPermissionData.push(encodedPermissionData[0]);
    const merkleTree = sessionKeyData.permissions?.length
        ? new merkletreejs_1.MerkleTree(encodedPermissionData, viem_1.keccak256, {
            sortPairs: true,
            hashLeaves: true
        })
        : new merkletreejs_1.MerkleTree([(0, viem_1.pad)("0x00", { size: 32 })], viem_1.keccak256, {
            hashLeaves: false,
            complete: true
        });
    const getEnableData = async (kernelAccountAddress, enabledLastNonce) => {
        if (!kernelAccountAddress) {
            throw new Error("Kernel account address not provided");
        }
        const lastNonce = enabledLastNonce ??
            (await getSessionNonces(kernelAccountAddress)).lastNonce + 1n;
        return (0, utils_1.concat)([
            signer.address,
            (0, viem_1.pad)(merkleTree.getHexRoot(), { size: 32 }),
            (0, viem_1.pad)((0, viem_1.toHex)(sessionKeyData?.validAfter ?? 0), {
                size: 6
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(sessionKeyData?.validUntil ?? 0), {
                size: 6
            }),
            sessionKeyData?.paymaster ?? viem_1.zeroAddress,
            (0, viem_1.pad)((0, viem_1.toHex)(lastNonce), { size: 32 })
        ]);
    };
    const getSessionNonces = async (kernelAccountAddress) => {
        const nonce = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
            abi: SessionKeyValidatorAbi_js_1.SessionKeyValidatorAbi,
            address: validatorAddress,
            functionName: "nonces",
            args: [kernelAccountAddress]
        });
        return { lastNonce: nonce[0], invalidNonce: nonce[1] };
    };
    const getEncodedPermissionProofData = (callData) => {
        const matchingPermission = (0, utils_js_1.findMatchingPermissions)(callData, sessionKeyData?.permissions);
        if (!matchingPermission &&
            !(merkleTree.getHexRoot() === (0, viem_1.pad)("0x00", { size: 32 }))) {
            throw Error("SessionKeyValidator: No matching permission found for the userOp");
        }
        const encodedPermissionData = sessionKeyData?.permissions &&
            sessionKeyData.permissions.length !== 0 &&
            matchingPermission
            ? (0, utils_js_1.encodePermissionData)(matchingPermission)
            : "0x";
        let merkleProof = [];
        if (Array.isArray(matchingPermission)) {
            const encodedPerms = matchingPermission.map((permission) => (0, viem_1.keccak256)((0, utils_js_1.encodePermissionData)(permission)));
            merkleProof = encodedPerms.map((perm) => merkleTree.getHexProof(perm));
        }
        else if (matchingPermission) {
            merkleProof = merkleTree.getHexProof((0, viem_1.keccak256)(encodedPermissionData));
        }
        return sessionKeyData?.permissions &&
            sessionKeyData.permissions.length !== 0 &&
            matchingPermission
            ? (0, utils_js_1.encodePermissionData)(matchingPermission, merkleProof)
            : "0x";
    };
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "SessionKeyValidator",
        getIdentifier: () => validatorAddress,
        getEnableData,
        signUserOperation: async (userOperation) => {
            const userOpHash = (0, permissionless_1.getUserOperationHash)({
                userOperation: { ...userOperation, signature: "0x" },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message: { raw: userOpHash }
            });
            const fixedSignature = (0, utils_js_1.fixSignedData)(signature);
            return (0, utils_1.concat)([
                signer.address,
                fixedSignature,
                getEncodedPermissionProofData(userOperation.callData)
            ]);
        },
        async getNonceKey(_accountAddress, customNonceKey) {
            if (customNonceKey) {
                return customNonceKey;
            }
            return 0n;
        },
        async getDummySignature(userOperation) {
            return (0, utils_1.concat)([
                signer.address,
                sdk_2.constants.DUMMY_ECDSA_SIG,
                getEncodedPermissionProofData(userOperation.callData)
            ]);
        },
        getPluginSerializationParams: () => sessionKeyData,
        isEnabled: async (kernelAccountAddress, selector) => {
            try {
                const execDetail = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
                    abi: sdk_1.KernelAccountAbi,
                    address: kernelAccountAddress,
                    functionName: "getExecution",
                    args: [selector]
                });
                const enableData = await (0, utils_1.getAction)(client, actions_1.readContract, "readContract")({
                    abi: SessionKeyValidatorAbi_js_1.SessionKeyValidatorAbi,
                    address: validatorAddress,
                    functionName: "sessionData",
                    args: [signer.address, kernelAccountAddress]
                });
                const enableDataHex = (0, utils_1.concatHex)([
                    signer.address,
                    (0, viem_1.pad)(enableData[0], { size: 32 }),
                    (0, viem_1.pad)((0, viem_1.toHex)(enableData[1]), { size: 6 }),
                    (0, viem_1.pad)((0, viem_1.toHex)(enableData[2]), { size: 6 }),
                    enableData[3],
                    (0, viem_1.pad)((0, viem_1.toHex)(enableData[4]), { size: 32 })
                ]);
                return (execDetail.validator.toLowerCase() ===
                    validatorAddress.toLowerCase() &&
                    enableData[4] !== 0n &&
                    enableDataHex.toLowerCase() ===
                        (await getEnableData(kernelAccountAddress, enableData[4])).toLowerCase());
            }
            catch (error) {
                return false;
            }
        }
    };
}
exports.signerToSessionKeyValidator = signerToSessionKeyValidator;
//# sourceMappingURL=toSessionKeyValidatorPlugin.js.map