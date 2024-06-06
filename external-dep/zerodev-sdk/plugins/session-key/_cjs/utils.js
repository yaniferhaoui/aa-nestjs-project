"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingPermissions = exports.deserializeSessionKeyAccountParams = exports.serializeSessionKeyAccountParams = exports.isSessionKeyValidatorPlugin = exports.bytesToBase64 = exports.base64ToBytes = exports.encodePermissionData = exports.fixSignedData = exports.getPermissionFromABI = void 0;
const sdk_1 = require("@zerodev/sdk");
const viem_1 = require("viem");
const index_js_1 = require("./index.js");
const toSessionKeyValidatorPlugin_js_1 = require("./toSessionKeyValidatorPlugin.js");
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
            param: (0, viem_1.padHex)((0, viem_1.isHex)(arg.value)
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
const fixSignedData = (sig) => {
    let signature = sig;
    if (!(0, viem_1.isHex)(signature)) {
        signature = `0x${signature}`;
        if (!(0, viem_1.isHex)(signature)) {
            throw new Error(`Invalid signed data ${sig}`);
        }
    }
    let { r, s, v } = (0, viem_1.hexToSignature)(signature);
    if (v === 0n || v === 1n)
        v += 27n;
    const joined = (0, viem_1.signatureToHex)({ r, s, v: v });
    return joined;
};
exports.fixSignedData = fixSignedData;
const encodePermissionData = (permission, merkleProof) => {
    const permissionParam = {
        components: [
            {
                name: "index",
                type: "uint32"
            },
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
                components: [
                    {
                        name: "interval",
                        type: "uint48"
                    },
                    {
                        name: "runs",
                        type: "uint48"
                    },
                    {
                        internalType: "ValidAfter",
                        name: "validAfter",
                        type: "uint48"
                    }
                ],
                name: "executionRule",
                type: "tuple"
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
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
exports.base64ToBytes = base64ToBytes;
function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}
exports.bytesToBase64 = bytesToBase64;
function isSessionKeyValidatorPlugin(plugin) {
    return plugin?.getPluginSerializationParams !== undefined;
}
exports.isSessionKeyValidatorPlugin = isSessionKeyValidatorPlugin;
;
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const serializeSessionKeyAccountParams = (params) => {
    const jsonString = JSON.stringify(params);
    const uint8Array = new TextEncoder().encode(jsonString);
    const base64String = bytesToBase64(uint8Array);
    return base64String;
};
exports.serializeSessionKeyAccountParams = serializeSessionKeyAccountParams;
const deserializeSessionKeyAccountParams = (params) => {
    const uint8Array = base64ToBytes(params);
    const jsonString = new TextDecoder().decode(uint8Array);
    return JSON.parse(jsonString);
};
exports.deserializeSessionKeyAccountParams = deserializeSessionKeyAccountParams;
const findMatchingPermissions = (callData, permissionsList) => {
    try {
        const { functionName, args } = (0, viem_1.decodeFunctionData)({
            abi: sdk_1.KernelAccountAbi,
            data: callData
        });
        if (functionName !== "execute" &&
            functionName !== "executeBatch" &&
            functionName !== "executeDelegateCall")
            return undefined;
        if (functionName === "execute") {
            const [to, value, data] = args;
            return filterPermissions([to], [data], [value], permissionsList)?.[0];
        }
        else if (functionName === "executeDelegateCall") {
            const [to, data] = args;
            return filterPermissions([to], [data], [0n], permissionsList, toSessionKeyValidatorPlugin_js_1.Operation.DelegateCall)?.[0];
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
const filterPermissions = (targets, dataArray, values, permissionsList, operation = toSessionKeyValidatorPlugin_js_1.Operation.Call) => {
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
        const operationPermissions = filterByOperation(targetPermissions, operation);
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
    return permissions.filter((permission) => permission.operation === operation || toSessionKeyValidatorPlugin_js_1.Operation.Call === operation);
};
const filterBySignature = (permissions, signature) => {
    return permissions.filter((permission) => (permission.sig ?? (0, viem_1.pad)("0x", { size: 4 })).toLowerCase() ===
        signature ||
        (permission.sig === (0, viem_1.pad)("0x", { size: 4 }) && signature === "0x"));
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
        case index_js_1.ParamOperator.EQUAL:
            return dataParam === ruleParam;
        case index_js_1.ParamOperator.GREATER_THAN:
            return dataParam > ruleParam;
        case index_js_1.ParamOperator.LESS_THAN:
            return dataParam < ruleParam;
        case index_js_1.ParamOperator.GREATER_THAN_OR_EQUAL:
            return dataParam >= ruleParam;
        case index_js_1.ParamOperator.LESS_THAN_OR_EQUAL:
            return dataParam <= ruleParam;
        case index_js_1.ParamOperator.NOT_EQUAL:
            return dataParam !== ruleParam;
        default:
            return false;
    }
};
//# sourceMappingURL=utils.js.map