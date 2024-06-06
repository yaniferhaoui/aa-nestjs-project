import { encodeAbiParameters, getAbiItem, isHex, pad, toFunctionSelector, toHex } from "viem";
export function getPermissionFromABI({ abi, args, functionName }) {
    if (!abi || !functionName) {
        return {
            selector: undefined,
            rules: undefined
        };
    }
    const abiItem = getAbiItem({
        abi,
        args,
        name: functionName
    });
    if (abiItem?.type !== "function") {
        throw Error(`${functionName} not found in abi`);
    }
    const functionSelector = toFunctionSelector(abiItem);
    let paramRules = [];
    if (args && Array.isArray(args)) {
        paramRules = args
            .map((arg, i) => arg && {
            param: pad(isHex(arg.value)
                ? arg.value
                : toHex(arg.value), { size: 32 }),
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
export const encodePermissionData = (permission) => {
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
    return encodeAbiParameters(params, values);
};
//# sourceMappingURL=callPolicyUtils.js.map