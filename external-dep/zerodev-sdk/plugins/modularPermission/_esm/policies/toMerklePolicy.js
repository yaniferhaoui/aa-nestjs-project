import { MerkleTree } from "merkletreejs";
import { concatHex, encodeAbiParameters, keccak256, pad, toHex } from "viem";
import { MERKLE_POLICY_CONTRACT, PolicyFlags } from "../constants.js";
import { findMatchingPermissions, getPermissionFromABI } from "./merklePolicyUtils.js";
export var ParamOperator;
(function (ParamOperator) {
    ParamOperator[ParamOperator["EQUAL"] = 0] = "EQUAL";
    ParamOperator[ParamOperator["GREATER_THAN"] = 1] = "GREATER_THAN";
    ParamOperator[ParamOperator["LESS_THAN"] = 2] = "LESS_THAN";
    ParamOperator[ParamOperator["GREATER_THAN_OR_EQUAL"] = 3] = "GREATER_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["LESS_THAN_OR_EQUAL"] = 4] = "LESS_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["NOT_EQUAL"] = 5] = "NOT_EQUAL";
})(ParamOperator || (ParamOperator = {}));
export var Operation;
(function (Operation) {
    Operation[Operation["Call"] = 0] = "Call";
    Operation[Operation["DelegateCall"] = 1] = "DelegateCall";
})(Operation || (Operation = {}));
export async function toMerklePolicy({ policyAddress = MERKLE_POLICY_CONTRACT, policyFlag = PolicyFlags.FOR_ALL_VALIDATION, permissions = [] }) {
    const generatedPermissionParams = permissions?.map((perm) => getPermissionFromABI({
        abi: perm.abi,
        functionName: perm.functionName,
        args: perm.args
    }));
    permissions =
        permissions?.map((perm, index) => ({
            ...perm,
            valueLimit: perm.valueLimit ?? 0n,
            sig: perm.sig ??
                generatedPermissionParams?.[index]?.sig ??
                pad("0x", { size: 4 }),
            rules: perm.rules ?? generatedPermissionParams?.[index]?.rules ?? [],
            operation: perm.operation ?? Operation.Call
        })) ?? [];
    const encodedPermissionData = permissions.map((permission) => encodePermissionData(permission));
    if (encodedPermissionData.length && encodedPermissionData.length === 1)
        encodedPermissionData.push(encodedPermissionData[0]);
    const merkleTree = permissions.length
        ? new MerkleTree(encodedPermissionData, keccak256, {
            sortPairs: true,
            hashLeaves: true
        })
        : new MerkleTree([pad("0x00", { size: 32 })], keccak256, {
            hashLeaves: false,
            complete: true
        });
    const getEncodedPermissionProofData = (callData) => {
        const matchingPermission = findMatchingPermissions(callData, permissions);
        if (!matchingPermission &&
            !(merkleTree.getHexRoot() === pad("0x00", { size: 32 }))) {
            throw Error("SessionKeyValidator: No matching permission found for the userOp");
        }
        const encodedPermissionData = permissions && permissions.length !== 0 && matchingPermission
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
        return permissions && permissions.length !== 0 && matchingPermission
            ? encodePermissionData(matchingPermission, merkleProof)
            : "0x";
    };
    return {
        getPolicyData: () => {
            return pad(merkleTree.getHexRoot(), { size: 32 });
        },
        getPolicyInfoInBytes: () => {
            return concatHex([policyFlag, policyAddress]);
        },
        getSignaturePolicyData: (userOperation) => {
            const proofData = getEncodedPermissionProofData(userOperation.callData);
            return concatHex([
                policyAddress,
                pad(toHex(proofData.length / 2 - 1), { size: 32 }),
                proofData
            ]);
        },
        policyParams: {
            type: "merkle",
            policyAddress,
            policyFlag,
            permissions
        }
    };
}
export const encodePermissionData = (permission, merkleProof) => {
    const permissionParam = {
        components: [
            {
                name: "target",
                type: "address"
            },
            {
                name: "sig",
                type: "bytes4"
            },
            {
                name: "valueLimit",
                type: "uint256"
            },
            {
                components: [
                    {
                        name: "offset",
                        type: "uint256"
                    },
                    {
                        internalType: "enum ParamCondition",
                        name: "condition",
                        type: "uint8"
                    },
                    {
                        name: "param",
                        type: "bytes32"
                    }
                ],
                name: "rules",
                type: "tuple[]"
            },
            {
                internalType: "enum Operation",
                name: "operation",
                type: "uint8"
            }
        ],
        name: "permission",
        type: Array.isArray(permission) ? "tuple[]" : "tuple"
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let params;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let values;
    if (merkleProof) {
        params = [
            permissionParam,
            {
                name: "merkleProof",
                type: Array.isArray(merkleProof[0])
                    ? "bytes32[][]"
                    : "bytes32[]"
            }
        ];
        values = [permission, merkleProof];
    }
    else {
        params = [permissionParam];
        values = [permission];
    }
    return encodeAbiParameters(params, values);
};
//# sourceMappingURL=toMerklePolicy.js.map