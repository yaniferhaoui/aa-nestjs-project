import { keccak256, pad, toHex, zeroAddress } from "viem";
import { toAccount } from "viem/accounts";
import { getChainId, readContract, signMessage, signTypedData } from "viem/actions";
import { concat, concatHex, getAction } from "viem/utils";
import { SessionKeyValidatorAbi } from "./abi/SessionKeyValidatorAbi.js";
import { KernelAccountAbi } from "@zerodev/sdk";
import { constants } from "@zerodev/sdk";
import { MerkleTree } from "merkletreejs";
import { getEntryPointVersion, getUserOperationHash } from "permissionless";
import { SignTransactionNotSupportedBySmartAccount } from "permissionless/accounts";
import { SESSION_KEY_VALIDATOR_ADDRESS } from "./index.js";
import { encodePermissionData, findMatchingPermissions, fixSignedData, getPermissionFromABI } from "./utils.js";
export var Operation;
(function (Operation) {
    Operation[Operation["Call"] = 0] = "Call";
    Operation[Operation["DelegateCall"] = 1] = "DelegateCall";
})(Operation || (Operation = {}));
export var ParamOperator;
(function (ParamOperator) {
    ParamOperator[ParamOperator["EQUAL"] = 0] = "EQUAL";
    ParamOperator[ParamOperator["GREATER_THAN"] = 1] = "GREATER_THAN";
    ParamOperator[ParamOperator["LESS_THAN"] = 2] = "LESS_THAN";
    ParamOperator[ParamOperator["GREATER_THAN_OR_EQUAL"] = 3] = "GREATER_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["LESS_THAN_OR_EQUAL"] = 4] = "LESS_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["NOT_EQUAL"] = 5] = "NOT_EQUAL";
})(ParamOperator || (ParamOperator = {}));
export const anyPaymaster = "0x0000000000000000000000000000000000000001";
export async function signerToSessionKeyValidator(client, { signer, entryPoint: entryPointAddress, validatorData, validatorAddress = SESSION_KEY_VALIDATOR_ADDRESS }) {
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const sessionKeyData = {
        ...validatorData,
        validAfter: validatorData?.validAfter ?? 0,
        validUntil: validatorData?.validUntil ?? 0,
        paymaster: validatorData?.paymaster ?? zeroAddress
    };
    const generatedPermissionParams = validatorData?.permissions?.map((perm) => getPermissionFromABI({
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
                pad("0x", { size: 4 }),
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
            throw new SignTransactionNotSupportedBySmartAccount();
        }
    };
    // // Fetch chain id
    const [chainId] = await Promise.all([getChainId(client)]);
    // Build the EOA Signer
    const account = toAccount({
        address: viemSigner.address,
        async signMessage({ message }) {
            return signMessage(client, { account: viemSigner, message });
        },
        async signTransaction(_, __) {
            throw new SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return signTypedData(client, {
                account: viemSigner,
                ...typedData
            });
        }
    });
    const encodedPermissionData = sessionKeyData.permissions.map((permission) => encodePermissionData(permission));
    if (encodedPermissionData.length && encodedPermissionData.length === 1)
        encodedPermissionData.push(encodedPermissionData[0]);
    const merkleTree = sessionKeyData.permissions?.length
        ? new MerkleTree(encodedPermissionData, keccak256, {
            sortPairs: true,
            hashLeaves: true
        })
        : new MerkleTree([pad("0x00", { size: 32 })], keccak256, {
            hashLeaves: false,
            complete: true
        });
    const getEnableData = async (kernelAccountAddress, enabledLastNonce) => {
        if (!kernelAccountAddress) {
            throw new Error("Kernel account address not provided");
        }
        const lastNonce = enabledLastNonce ??
            (await getSessionNonces(kernelAccountAddress)).lastNonce + 1n;
        return concat([
            signer.address,
            pad(merkleTree.getHexRoot(), { size: 32 }),
            pad(toHex(sessionKeyData?.validAfter ?? 0), {
                size: 6
            }),
            pad(toHex(sessionKeyData?.validUntil ?? 0), {
                size: 6
            }),
            sessionKeyData?.paymaster ?? zeroAddress,
            pad(toHex(lastNonce), { size: 32 })
        ]);
    };
    const getSessionNonces = async (kernelAccountAddress) => {
        const nonce = await getAction(client, readContract, "readContract")({
            abi: SessionKeyValidatorAbi,
            address: validatorAddress,
            functionName: "nonces",
            args: [kernelAccountAddress]
        });
        return { lastNonce: nonce[0], invalidNonce: nonce[1] };
    };
    const getEncodedPermissionProofData = (callData) => {
        const matchingPermission = findMatchingPermissions(callData, sessionKeyData?.permissions);
        if (!matchingPermission &&
            !(merkleTree.getHexRoot() === pad("0x00", { size: 32 }))) {
            throw Error("SessionKeyValidator: No matching permission found for the userOp");
        }
        const encodedPermissionData = sessionKeyData?.permissions &&
            sessionKeyData.permissions.length !== 0 &&
            matchingPermission
            ? encodePermissionData(matchingPermission)
            : "0x";
        let merkleProof = [];
        if (Array.isArray(matchingPermission)) {
            const encodedPerms = matchingPermission.map((permission) => keccak256(encodePermissionData(permission)));
            merkleProof = encodedPerms.map((perm) => merkleTree.getHexProof(perm));
        }
        else if (matchingPermission) {
            merkleProof = merkleTree.getHexProof(keccak256(encodedPermissionData));
        }
        return sessionKeyData?.permissions &&
            sessionKeyData.permissions.length !== 0 &&
            matchingPermission
            ? encodePermissionData(matchingPermission, merkleProof)
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
            const userOpHash = getUserOperationHash({
                userOperation: { ...userOperation, signature: "0x" },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await signMessage(client, {
                account: viemSigner,
                message: { raw: userOpHash }
            });
            const fixedSignature = fixSignedData(signature);
            return concat([
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
            return concat([
                signer.address,
                constants.DUMMY_ECDSA_SIG,
                getEncodedPermissionProofData(userOperation.callData)
            ]);
        },
        getPluginSerializationParams: () => sessionKeyData,
        isEnabled: async (kernelAccountAddress, selector) => {
            try {
                const execDetail = await getAction(client, readContract, "readContract")({
                    abi: KernelAccountAbi,
                    address: kernelAccountAddress,
                    functionName: "getExecution",
                    args: [selector]
                });
                const enableData = await getAction(client, readContract, "readContract")({
                    abi: SessionKeyValidatorAbi,
                    address: validatorAddress,
                    functionName: "sessionData",
                    args: [signer.address, kernelAccountAddress]
                });
                const enableDataHex = concatHex([
                    signer.address,
                    pad(enableData[0], { size: 32 }),
                    pad(toHex(enableData[1]), { size: 6 }),
                    pad(toHex(enableData[2]), { size: 6 }),
                    enableData[3],
                    pad(toHex(enableData[4]), { size: 32 })
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
//# sourceMappingURL=toSessionKeyValidatorPlugin.js.map