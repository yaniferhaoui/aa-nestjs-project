"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePermissionData = exports.getPermissionFromABI = void 0;
const viem_1 = require("viem");
function getPermissionFromABI({ abi, args, functionName }) {
    if (!abi || !functionName) {
        return {
            selector: undefined,
            rules: undefined
        };
    }
    const abiItem = (0, viem_1.getAbiItem)({
        abi,
        args,
        name: functionName
    });
    if (abiItem?.type !== "function") {
        throw Error(`${functionName} not found in abi`);
    }
    const functionSelector = (0, viem_1.toFunctionSelector)(abiItem);
    let paramRules = [];
    if (args && Array.isArray(args)) {
        paramRules = args
            .map((arg, i) => arg && {
            param: (0, viem_1.pad)((0, viem_1.isHex)(arg.value)
                ? arg.value
                : (0, viem_1.toHex)(arg.value), { size: 32 }),
            offset: i * 32,
            condition: arg.condition
        })
            .filter((rule) => rule);
    }
    return {
        selector: functionSelector,
        rules: paramRules
    };
}
exports.getPermissionFromABI = getPermissionFromABI;
const encodePermissionData = (permission) => {
    const permissionParam = {
        components: [
            {
                internalType: "enum CallType",
                name: "callType",
                type: "bytes1"
            },
            {
                name: "target",
                type: "address"
            },
            {
                name: "selector",
                type: "bytes4"
            },
            {
                name: "valueLimit",
                type: "uint256"
            },
            {
                components: [
                    {
                        internalType: "enum ParamCondition",
                        name: "condition",
                        type: "uint8"
                    },
                    {
                        name: "offset",
                        type: "uint64"
                    },
                    {
                        name: "param",
                        type: "bytes32"
                    }
                ],
                name: "rules",
                type: "tuple[]"
            }
        ],
        name: "permission",
        type: "tuple[]"
    };
    const params = [permissionParam];
    const values = [permission];
    return (0, viem_1.encodeAbiParameters)(params, values);
};
exports.encodePermissionData = encodePermissionData;
//# sourceMappingURL=callPolicyUtils.js.map