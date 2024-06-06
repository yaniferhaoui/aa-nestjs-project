"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountMetadata = void 0;
const viem_1 = require("viem");
const constants_js_1 = require("../../../../constants.js");
const utils_js_1 = require("../../../../utils.js");
const EIP1271Abi_js_1 = require("../../abi/EIP1271Abi.js");
const accountMetadata = async (client, accountAddress, entryPointAddress) => {
    try {
        const domain = await client.request({
            method: "eth_call",
            params: [
                {
                    to: accountAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: EIP1271Abi_js_1.EIP1271Abi,
                        functionName: "eip712Domain"
                    })
                },
                "latest"
            ]
        });
        if (domain !== "0x") {
            const decoded = (0, viem_1.decodeFunctionResult)({
                abi: [...EIP1271Abi_js_1.EIP1271Abi],
                functionName: "eip712Domain",
                data: domain
            });
            return {
                name: decoded[1],
                version: decoded[2],
                chainId: decoded[3]
            };
        }
    }
    catch (error) { }
    return {
        name: constants_js_1.KERNEL_NAME,
        version: (0, utils_js_1.getKernelVersion)(entryPointAddress),
        chainId: client.chain
            ? BigInt(client.chain.id)
            : BigInt(await client.extend(viem_1.publicActions).getChainId())
    };
};
exports.accountMetadata = accountMetadata;
//# sourceMappingURL=accountMetadata.js.map