"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KernelFactoryToInitCodeHashMap = exports.safeCreateCallAddress = exports.EXEC_TYPE = exports.CALL_TYPE = exports.VALIDATOR_MODE = exports.VALIDATOR_TYPE = exports.LATEST_KERNEL_VERSION = exports.KERNEL_NAME = exports.ONLY_ENTRYPOINT_HOOK_ADDRESS = exports.TOKEN_ACTION = exports.KernelImplToVersionMap = exports.DUMMY_ECDSA_SIG = void 0;
exports.DUMMY_ECDSA_SIG = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
exports.KernelImplToVersionMap = {
    "0x8dD4DBB54d8A8Cf0DE6F9CCC4609470A30EfF18C": "0.2.2",
    "0x0DA6a956B9488eD4dd761E59f52FDc6c8068E6B5": "0.2.2",
    "0xD3F582F6B4814E989Ee8E96bc3175320B5A540ab": "0.2.3",
    "0x5FC0236D6c88a65beD32EECDC5D60a5CAb377717": "0.2.3",
    "0xd3082872F8B06073A021b4602e022d5A070d7cfC": "0.2.4",
    "0x94F097E1ebEB4ecA3AAE54cabb08905B239A7D27": "0.3.0-beta"
};
exports.TOKEN_ACTION = "0x2087C7FfD0d0DAE80a00EE74325aBF3449e0eaf1";
exports.ONLY_ENTRYPOINT_HOOK_ADDRESS = "0xb230f0A1C7C95fa11001647383c8C7a8F316b900";
exports.KERNEL_NAME = "Kernel";
exports.LATEST_KERNEL_VERSION = {
    "v0.6": "0.2.4",
    "v0.7": "0.3.0-beta"
};
exports.VALIDATOR_TYPE = {
    SUDO: "0x00",
    SECONDARY: "0x01",
    PERMISSION: "0x02"
};
var VALIDATOR_MODE;
(function (VALIDATOR_MODE) {
    VALIDATOR_MODE["DEFAULT"] = "0x00";
    VALIDATOR_MODE["ENABLE"] = "0x01";
})(VALIDATOR_MODE || (exports.VALIDATOR_MODE = VALIDATOR_MODE = {}));
var CALL_TYPE;
(function (CALL_TYPE) {
    CALL_TYPE["SINGLE"] = "0x00";
    CALL_TYPE["BATCH"] = "0x01";
    CALL_TYPE["DELEGATE_CALL"] = "0xFF";
})(CALL_TYPE || (exports.CALL_TYPE = CALL_TYPE = {}));
var EXEC_TYPE;
(function (EXEC_TYPE) {
    EXEC_TYPE["DEFAULT"] = "0x00";
    EXEC_TYPE["TRY_EXEC"] = "0x01";
})(EXEC_TYPE || (exports.EXEC_TYPE = EXEC_TYPE = {}));
exports.safeCreateCallAddress = "0x9b35Af71d77eaf8d7e40252370304687390A1A52";
exports.KernelFactoryToInitCodeHashMap = {
    "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3": "0xee9d8350bd899dd261db689aafd87eb8a30f085adbaff48152399438ff4eed73",
    "0x6723b44Abeec4E71eBE3232BD5B455805baDD22f": "0x6fe6e6ea30eddce942b9618033ab8429f9ddac594053bec8a6744fffc71976e2"
};
//# sourceMappingURL=constants.js.map