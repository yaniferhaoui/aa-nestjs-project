"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePermissionData = exports.toMerklePolicy = exports.Operation = exports.ParamOperator = void 0;
const merkletreejs_1 = require("merkletreejs");
const viem_1 = require("viem");
const constants_js_1 = require("../constants.js");
const merklePolicyUtils_js_1 = require("./merklePolicyUtils.js");
var ParamOperator;
(function (ParamOperator) {
    ParamOperator[ParamOperator["EQUAL"] = 0] = "EQUAL";
    ParamOperator[ParamOperator["GREATER_THAN"] = 1] = "GREATER_THAN";
    ParamOperator[ParamOperator["LESS_THAN"] = 2] = "LESS_THAN";
    ParamOperator[ParamOperator["GREATER_THAN_OR_EQUAL"] = 3] = "GREATER_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["LESS_THAN_OR_EQUAL"] = 4] = "LESS_THAN_OR_EQUAL";
    ParamOperator[ParamOperator["NOT_EQUAL"] = 5] = "NOT_EQUAL";
})(ParamOperator || (exports.ParamOperator = ParamOperator = {}));
var Operation;
(function (Operation) {
    Operation[Operation["Call"] = 0] = "Call";
    Operation[Operation["DelegateCall"] = 1] = "DelegateCall";
})(Operation || (exports.Operation = Operation = {}));
async function toMerklePolicy({ policyAddress = constants_js_1.MERKLE_POLICY_CONTRACT, policyFlag = constants_js_1.PolicyFlags.FOR_ALL_VALIDATION, permissions = [] }) {
    const generatedPermissionParams = permissions?.map((perm) => (0, merklePolicyUtils_js_1.getPermissionFromABI)({
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
                (0, viem_1.pad)("0x", { size: 4 }),
            rules: perm.rules ?? generatedPermissionParams?.[index]?.rules ?? [],
            operation: perm.operation ?? Operation.Call
        })) ?? [];
    const encodedPermissionData = permissions.map((permission) => (0, exports.encodePermissionData)(permission));
    if (encodedPermissionData.length && encodedPermissionData.length === 1)
        encodedPermissionData.push(encodedPermissionData[0]);
    const merkleTree = permissions.length
        ? new merkletreejs_1.MerkleTree(encodedPermissionData, viem_1.keccak256, {
            sortPairs: true,
            hashLeaves: true
        })
        : new merkletreejs_1.MerkleTree([(0, viem_1.pad)("0x00", { size: 32 })], viem_1.keccak256, {
            hashLeaves: false,
            complete: true
        });
    const getEncodedPermissionProofData = (callData) => {
        const matchingPermission = (0, merklePolicyUtils_js_1.findMatchingPermissions)(callData, permissions);
        if (!matchingPermission &&
            !(merkleTree.getHexRoot() === (0, viem_1.pad)("0x00", { size: 32 }))) {
            throw Error("SessionKeyValidator: No matching permission found for the userOp");
        }
        const encodedPermissionData = permissions && permissions.length !== 0 && matchingPermission
            ? (0, exports.encodePermissionData)(matchingPermission)
            : "0x";
        let merkleProof = [];
        if (Array.isArray(matchingPermission)) {
            const encodedPerms = matchingPermission.map((permission) => (0, viem_1.keccak256)((0, exports.encodePermissionData)(permission)));
            merkleProof = encodedPerms.map((perm) => merkleTree.getHexProof(perm));
        }
        else if (matchingPermission) {
            merkleProof = merkleTree.getHexProof((0, viem_1.keccak256)(encodedPermissionData));
        }
        return permissions && permissions.length !== 0 && matchingPermission
            ? (0, exports.encodePermissionData)(matchingPermission, merkleProof)
            : "0x";
    };
    return {
        getPolicyData: () => {
            return (0, viem_1.pad)(merkleTree.getHexRoot(), { size: 32 });
        },
        getPolicyInfoInBytes: () => {
            return (0, viem_1.concatHex)([policyFlag, policyAddress]);
        },
        getSignaturePolicyData: (userOperation) => {
            const proofData = getEncodedPermissionProofData(userOperation.callData);
            return (0, viem_1.concatHex)([
                policyAddress,
                (0, viem_1.pad)((0, viem_1.toHex)(proofData.length / 2 - 1), { size: 32 }),
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
exports.toMerklePolicy = toMerklePolicy;
const encodePermissionData = (permission, merkleProof) => {
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
    let params;
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
    return (0, viem_1.encodeAbiParameters)(params, values);
};
exports.encodePermissionData = encodePermissionData;
//# sourceMappingURL=toMerklePolicy.js.map