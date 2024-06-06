import { KernelAccountAbi } from "@zerodev/sdk";
import { decodeFunctionData, getAbiItem, isHex, pad, toFunctionSelector, toHex, zeroAddress } from "viem";
import { Operation, ParamOperator } from "./toMerklePolicy.js";
export const findMatchingPermissions = (callData, permissionsList) => {
    try {
        const { functionName, args } = decodeFunctionData({
            abi: KernelAccountAbi,
            data: callData
        });
        if (functionName !== "execute" && functionName !== "executeBatch")
            return undefined;
        if (functionName === "execute") {
            const [to, value, data] = args;
            return filterPermissions([to], [data], [value], permissionsList)?.[0];
        }
        else if (functionName === "executeBatch") {
            const targets = [];
            const values = [];
            const dataArray = [];
            for (const arg of args[0]) {
                targets.push(arg.to);
                values.push(arg.value);
                dataArray.push(arg.data);
            }
            return filterPermissions(targets, dataArray, values, permissionsList);
        }
        throw Error("Invalid function");
    }
    catch (error) {
        return undefined;
    }
};
const filterPermissions = (targets, dataArray, values, permissionsList) => {
    if (targets.length !== dataArray.length ||
        targets.length !== values.length) {
        throw Error("Invalid arguments");
    }
    const filteredPermissions = targets.map((target, index) => {
        if (!permissionsList || !permissionsList.length)
            return undefined;
        const targetToMatch = target.toLowerCase();
        // Filter permissions by target
        const targetPermissions = permissionsList.filter((permission) => permission.target.toLowerCase() === targetToMatch ||
            permission.target.toLowerCase() === zeroAddress.toLowerCase());
        if (!targetPermissions.length)
            return undefined;
        const operationPermissions = filterByOperation(targetPermissions, 
        // [TODO]: Check if we need to pass operation from userOp after Kernel v2.3 in
        Operation.Call);
        if (!operationPermissions.length)
            return undefined;
        const signaturePermissions = filterBySignature(targetPermissions, dataArray[index].slice(0, 10).toLowerCase());
        const valueLimitPermissions = signaturePermissions.filter((permission) => (permission.valueLimit ?? 0n) >= values[index]);
        if (!valueLimitPermissions.length)
            return undefined;
        const sortedPermissions = valueLimitPermissions.sort((a, b) => {
            if ((b.valueLimit ?? 0n) > (a.valueLimit ?? 0n)) {
                return 1;
            }
            else if ((b.valueLimit ?? 0n) < (a.valueLimit ?? 0n)) {
                return -1;
            }
            else {
                return 0;
            }
        });
        return findPermissionByRule(sortedPermissions, dataArray[index]);
    });
    return filteredPermissions.every((permission) => permission !== undefined)
        ? filteredPermissions
        : undefined;
};
const filterByOperation = (permissions, operation) => {
    return permissions.filter((permission) => permission.operation === operation || Operation.Call === operation);
};
const filterBySignature = (permissions, signature) => {
    return permissions.filter((permission) => (permission.sig ?? pad("0x", { size: 4 })).toLowerCase() ===
        signature);
};
const findPermissionByRule = (permissions, data) => {
    return permissions.find((permission) => {
        for (const rule of permission.rules ?? []) {
            const dataParam = getFormattedHex(`0x${data.slice(10 + rule.offset * 2, 10 + rule.offset * 2 + 64)}`);
            const ruleParam = getFormattedHex(rule.param);
            if (!evaluateRuleCondition(dataParam, ruleParam, rule.condition)) {
                return false;
            }
        }
        return true;
    });
};
const getFormattedHex = (value) => {
    return pad(isHex(value) ? value : toHex(value), {
        size: 32
    }).toLowerCase();
};
const evaluateRuleCondition = (dataParam, ruleParam, condition) => {
    switch (condition) {
        case ParamOperator.EQUAL:
            return dataParam === ruleParam;
        case ParamOperator.GREATER_THAN:
            return dataParam > ruleParam;
        case ParamOperator.LESS_THAN:
            return dataParam < ruleParam;
        case ParamOperator.GREATER_THAN_OR_EQUAL:
            return dataParam >= ruleParam;
        case ParamOperator.LESS_THAN_OR_EQUAL:
            return dataParam <= ruleParam;
        case ParamOperator.NOT_EQUAL:
            return dataParam !== ruleParam;
        default:
            return false;
    }
};
export function getPermissionFromABI({ abi, args, functionName }) {
    if (!abi || !functionName) {
        return {
            sig: undefined,
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
            condition: arg.operator
        })
            .filter((rule) => rule);
    }
    return {
        sig: functionSelector,
        rules: paramRules
    };
}
//# sourceMappingURL=merklePolicyUtils.js.map