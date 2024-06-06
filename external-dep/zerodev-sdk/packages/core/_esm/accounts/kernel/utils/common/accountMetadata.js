import { decodeFunctionResult, encodeFunctionData, publicActions } from "viem";
import { KERNEL_NAME } from "../../../../constants.js";
import { getKernelVersion } from "../../../../utils.js";
import { EIP1271Abi } from "../../abi/EIP1271Abi.js";
export const accountMetadata = async (client, accountAddress, entryPointAddress) => {
    try {
        const domain = await client.request({
            method: "eth_call",
            params: [
                {
                    to: accountAddress,
                    data: encodeFunctionData({
                        abi: EIP1271Abi,
                        functionName: "eip712Domain"
                    })
                },
                "latest"
            ]
        });
        if (domain !== "0x") {
            const decoded = decodeFunctionResult({
                abi: [...EIP1271Abi],
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
        name: KERNEL_NAME,
        version: getKernelVersion(entryPointAddress),
        chainId: client.chain
            ? BigInt(client.chain.id)
            : BigInt(await client.extend(publicActions).getChainId())
    };
};
//# sourceMappingURL=accountMetadata.js.map