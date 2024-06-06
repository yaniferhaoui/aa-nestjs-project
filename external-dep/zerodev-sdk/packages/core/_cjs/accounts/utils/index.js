"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomNonceKeyFromString = exports.parseFactoryAddressAndCallDataFromAccountInitCode = exports.universalValidatorByteCode = exports.verifyEIP6492Signature = exports.toKernelPluginManager = void 0;
var toKernelPluginManager_js_1 = require("./toKernelPluginManager.js");
Object.defineProperty(exports, "toKernelPluginManager", { enumerable: true, get: function () { return toKernelPluginManager_js_1.toKernelPluginManager; } });
var _6492_js_1 = require("./6492.js");
Object.defineProperty(exports, "verifyEIP6492Signature", { enumerable: true, get: function () { return _6492_js_1.verifyEIP6492Signature; } });
Object.defineProperty(exports, "universalValidatorByteCode", { enumerable: true, get: function () { return _6492_js_1.universalValidatorByteCode; } });
const parseFactoryAddressAndCallDataFromAccountInitCode = (initCode) => {
    const factoryAddress = `0x${initCode.substring(2, 42)}`;
    const factoryCalldata = `0x${initCode.substring(42)}`;
    return [factoryAddress, factoryCalldata];
};
exports.parseFactoryAddressAndCallDataFromAccountInitCode = parseFactoryAddressAndCallDataFromAccountInitCode;
var getCustomNonceKeyFromString_js_1 = require("./getCustomNonceKeyFromString.js");
Object.defineProperty(exports, "getCustomNonceKeyFromString", { enumerable: true, get: function () { return getCustomNonceKeyFromString_js_1.getCustomNonceKeyFromString; } });
//# sourceMappingURL=index.js.map