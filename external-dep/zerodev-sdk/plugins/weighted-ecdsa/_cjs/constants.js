"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V07 = exports.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V06 = exports.getRecoveryAction = void 0;
const sdk_1 = require("@zerodev/sdk");
const permissionless_1 = require("permissionless");
const viem_1 = require("viem");
const RECOVERY_ACTION_ADDRESS_V06 = "0x2f65dB8039fe5CAEE0a8680D2879deB800F31Ae1";
const RECOVERY_ACTION_ADDRESS_V07 = "0xe884C2868CC82c16177eC73a93f7D9E6F3A5DC6E";
const RECOVERY_ACTION_SELECTOR = (0, viem_1.toFunctionSelector)("doRecovery(address, bytes)");
const getRecoveryAction = (entryPoint) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPoint);
    if (entryPointVersion === "v0.6") {
        return {
            address: RECOVERY_ACTION_ADDRESS_V06,
            selector: RECOVERY_ACTION_SELECTOR
        };
    }
    return {
        address: RECOVERY_ACTION_ADDRESS_V07,
        selector: RECOVERY_ACTION_SELECTOR,
        hook: {
            address: sdk_1.constants.ONLY_ENTRYPOINT_HOOK_ADDRESS
        }
    };
};
exports.getRecoveryAction = getRecoveryAction;
exports.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V06 = "0x8012D9ee59176Cb01a4aa80fCFE6f5E8bA58d4fb";
exports.WEIGHTED_ECDSA_VALIDATOR_ADDRESS_V07 = "0xeD89244160CfE273800B58b1B534031699dFeEEE";
//# sourceMappingURL=constants.js.map