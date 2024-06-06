"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionFromABI = exports.findMatchingPermissions = void 0;
const sdk_1 = require("@zerodev/sdk");
const viem_1 = require("viem");
const toMerklePolicy_js_1 = require("./toMerklePolicy.js");
const findMatchingPermissions = (callData, permissionsList) => {
    try {
        const { functionName, args } = (0, viem_1.decodeFunctionData)({
            abi: sdk_1.KernelAccountAbi,
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
exports.findMatchingPermissions = findMatchingPermissions;
const filterPermissions = (targets, dataArray, values, permissionsList) => {
    if (targets.length !== dataArray.length ||
        targets.length !== values.length) {
        throw Error("Invalid arguments");
    }
    const filteredPermissions = targets.map((target, index) => {
        if (!permissionsList || !permissionsList.length)
            return undefined;
        const targetToMatch = target.toLowerCase();
        const targetPermissions = permissionsList.filter((permission) => permission.target.toLowerCase() === targetToMatch ||
            permission.target.toLowerCase() === viem_1.zeroAddress.toLowerCase());
        if (!targetPermissions.length)
            return undefined;
        const operationPermissions = filterByOperation(targetPermissions, toMerklePolicy_js_1.Operation.Call);
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
    return permissions.filter((permission) => permission.operation === operation || toMerklePolicy_js_1.Operation.Call === operation);
};
const filterBySignature = (permissions, signature) => {
    return permissions.filter((permission) => (permission.sig ?? (0, viem_1.pad)("0x", { size: 4 })).toLowerCase() ===
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
    return (0, viem_1.pad)((0, viem_1.isHex)(value) ? value : (0, viem_1.toHex)(value), {
        size: 32
    }).toLowerCase();
};
const evaluateRuleCondition = (dataParam, ruleParam, condition) => {
    switch (condition) {
        case toMerklePolicy_js_1.ParamOperator.EQUAL:
            return dataParam === ruleParam;
        case toMerklePolicy_js_1.ParamOperator.GREATER_THAN:
            return dataParam > ruleParam;
        case toMerklePolicy_js_1.ParamOperator.LESS_THAN:
            return dataParam < ruleParam;
        case toMerklePolicy_js_1.ParamOperator.GREATER_THAN_OR_EQUAL:
            return dataParam >= ruleParam;
        case toMerklePolicy_js_1.ParamOperator.LESS_THAN_OR_EQUAL:
            return dataParam <= ruleParam;
        case toMerklePolicy_js_1.ParamOperator.NOT_EQUAL:
            return dataParam !== ruleParam;
        default:
            return false;
    }
};
function getPermissionFromABI({ abi, args, functionName }) {
    if (!abi || !functionName) {
        return {
            sig: undefined,
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
            condition: arg.operator
        })
            .filter((rule) => rule);
    }
    return {
        sig: functionSelector,
        rules: paramRules
    };
}
exports.getPermissionFromABI = getPermissionFromABI;
//# sourceMappingURL=merklePolicyUtils.js.map