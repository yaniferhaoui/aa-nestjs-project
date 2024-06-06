import { concat, encodeAbiParameters, pad, parseAbiParameters, zeroAddress } from "viem";
import { CALL_TYPE, VALIDATOR_TYPE } from "../../../../../constants.js";
export const getPluginsEnableTypedData = async ({ accountAddress, chainId, kernelVersion, action, validator, validatorNonce }) => {
    return {
        domain: {
            name: "Kernel",
            version: kernelVersion,
            chainId,
            verifyingContract: accountAddress
        },
        types: {
            Enable: [
                { name: "validationId", type: "bytes21" },
                { name: "nonce", type: "uint32" },
                { name: "hook", type: "address" },
                { name: "validatorData", type: "bytes" },
                { name: "hookData", type: "bytes" },
                { name: "selectorData", type: "bytes" }
            ]
        },
        message: {
            validationId: concat([
                VALIDATOR_TYPE[validator.validatorType],
                pad(validator.getIdentifier(), { size: 20, dir: "right" })
            ]),
            nonce: validatorNonce,
            hook: zeroAddress,
            validatorData: await validator.getEnableData(accountAddress),
            hookData: "0x",
            selectorData: concat([
                action.selector,
                action.address,
                action.hook?.address ?? zeroAddress,
                encodeAbiParameters(parseAbiParameters("bytes selectorInitData, bytes hookInitData"), [CALL_TYPE.DELEGATE_CALL, "0x0000"])
            ])
        },
        primaryType: "Enable"
    };
};
//# sourceMappingURL=getPluginsEnableTypedData.js.map