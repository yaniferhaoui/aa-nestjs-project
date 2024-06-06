"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatorAddress = exports.WEBAUTHN_VALIDATOR_ADDRESS_V07 = exports.WEBAUTHN_VALIDATOR_ADDRESS_V06 = exports.getPasskeyValidator = exports.createPasskeyValidator = exports.deserializePasskeyValidator = void 0;
const permissionless_1 = require("permissionless");
const toPasskeyValidator_js_1 = require("./toPasskeyValidator.js");
Object.defineProperty(exports, "createPasskeyValidator", { enumerable: true, get: function () { return toPasskeyValidator_js_1.createPasskeyValidator; } });
Object.defineProperty(exports, "deserializePasskeyValidator", { enumerable: true, get: function () { return toPasskeyValidator_js_1.deserializePasskeyValidator; } });
Object.defineProperty(exports, "getPasskeyValidator", { enumerable: true, get: function () { return toPasskeyValidator_js_1.getPasskeyValidator; } });
exports.WEBAUTHN_VALIDATOR_ADDRESS_V06 = "0x1e02Ff20b604C2B2809193917Ea22D8602126837";
exports.WEBAUTHN_VALIDATOR_ADDRESS_V07 = "0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06";
const getValidatorAddress = (entryPointAddress) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    return entryPointVersion === "v0.6"
        ? exports.WEBAUTHN_VALIDATOR_ADDRESS_V06
        : exports.WEBAUTHN_VALIDATOR_ADDRESS_V07;
};
exports.getValidatorAddress = getValidatorAddress;
//# sourceMappingURL=index.js.map