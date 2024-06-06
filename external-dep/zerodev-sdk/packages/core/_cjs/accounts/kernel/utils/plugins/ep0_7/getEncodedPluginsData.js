"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncodedPluginsData = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../../../../../constants.js");
const getEncodedPluginsData = async ({ accountAddress, enableSignature, userOpSignature, action, validator }) => {
    const enableData = await validator.getEnableData(accountAddress);
    return (0, viem_1.concat)([
        viem_1.zeroAddress,
        (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("bytes validatorData, bytes hookData, bytes selectorData, bytes enableSig, bytes userOpSig"), [
            enableData,
            "0x",
            (0, viem_1.concat)([
                action.selector,
                action.address,
                action.hook?.address ?? viem_1.zeroAddress,
                (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("bytes selectorInitData, bytes hookInitData"), [constants_js_1.CALL_TYPE.DELEGATE_CALL, "0x0000"])
            ]),
            enableSignature,
            userOpSignature
        ])
    ]);
};
exports.getEncodedPluginsData = getEncodedPluginsData;
//# sourceMappingURL=getEncodedPluginsData.js.map