import { concat, encodeAbiParameters, parseAbiParameters, zeroAddress } from "viem";
import { CALL_TYPE } from "../../../../../constants.js";
export const getEncodedPluginsData = async ({ accountAddress, enableSignature, userOpSignature, action, validator }) => {
    const enableData = await validator.getEnableData(accountAddress);
    return concat([
        zeroAddress, // hook address 20 bytes
        encodeAbiParameters(parseAbiParameters("bytes validatorData, bytes hookData, bytes selectorData, bytes enableSig, bytes userOpSig"), [
            enableData,
            "0x",
            concat([
                action.selector,
                action.address,
                action.hook?.address ?? zeroAddress,
                encodeAbiParameters(parseAbiParameters("bytes selectorInitData, bytes hookInitData"), 
                // [TODO]: Add support for other call_type
                [CALL_TYPE.DELEGATE_CALL, "0x0000"])
            ]),
            enableSignature,
            userOpSignature
        ])
    ]);
};
//# sourceMappingURL=getEncodedPluginsData.js.map