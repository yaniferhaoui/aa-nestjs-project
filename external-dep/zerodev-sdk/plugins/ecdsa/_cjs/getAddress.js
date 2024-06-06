"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKernelAddressFromECDSA = void 0;
const sdk_1 = require("@zerodev/sdk");
const permissionless_1 = require("permissionless");
const viem_1 = require("viem");
const constants_js_1 = require("./constants.js");
const getInitCodeHash = async (publicClient, entryPointAddress) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion === "v0.6") {
        return await initCodeHashV0_6(publicClient);
    }
    return initCodeHashV0_7(sdk_1.KERNEL_ADDRESSES.ACCOUNT_LOGIC_V0_7);
};
const initCodeHashV0_6 = async (publicClient) => {
    const factoryContract = (0, viem_1.getContract)({
        address: sdk_1.KERNEL_ADDRESSES.FACTORY_ADDRESS_V0_6,
        abi: [
            {
                type: "function",
                name: "initCodeHash",
                inputs: [],
                outputs: [
                    {
                        name: "result",
                        type: "bytes32",
                        internalType: "bytes32"
                    }
                ],
                stateMutability: "view"
            }
        ],
        client: publicClient
    });
    return await factoryContract.read.initCodeHash();
};
const initCodeHashV0_7 = (implementationAddress) => {
    if (!(0, viem_1.isAddress)(implementationAddress)) {
        throw new Error("Invalid implementation address");
    }
    const initCode = (0, viem_1.concatHex)([
        "0x603d3d8160223d3973",
        implementationAddress,
        "0x6009",
        "0x5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076",
        "0xcc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3"
    ]);
    const hash = (0, viem_1.keccak256)(initCode);
    return hash;
};
const generateSaltForV06 = (eoaAddress, index) => {
    const encodedIndex = (0, viem_1.toHex)(index, { size: 32 });
    const initData = (0, viem_1.encodeFunctionData)({
        abi: sdk_1.KernelAccountAbi,
        functionName: "initialize",
        args: [constants_js_1.ECDSA_VALIDATOR_ADDRESS_V06, eoaAddress]
    });
    const encodedSalt = (0, viem_1.concat)([initData, encodedIndex]);
    const salt = BigInt((0, viem_1.keccak256)(encodedSalt));
    const mask = BigInt("0xffffffffffffffffffffffff");
    const maskedSalt = (0, viem_1.toHex)(salt & mask, { size: 32 });
    return maskedSalt;
};
const generateSaltForV07 = (eoaAddress, index, hookAddress, hookData) => {
    const encodedIndex = (0, viem_1.toHex)(index, { size: 32 });
    const initData = (0, viem_1.encodeFunctionData)({
        abi: sdk_1.KernelV3InitAbi,
        functionName: "initialize",
        args: [
            (0, viem_1.concatHex)([
                sdk_1.constants.VALIDATOR_TYPE.SECONDARY,
                constants_js_1.ECDSA_VALIDATOR_ADDRESS_V07
            ]),
            hookAddress,
            eoaAddress,
            hookData
        ]
    });
    const packedData = (0, viem_1.concatHex)([initData, encodedIndex]);
    return (0, viem_1.keccak256)(packedData);
};
async function getKernelAddressFromECDSA(params) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(params.entryPointAddress);
    const bytecodeHash = await (async () => {
        if ("initCodeHash" in params && params.initCodeHash) {
            return params.initCodeHash;
        }
        if ("publicClient" in params && params.publicClient) {
            return await getInitCodeHash(params.publicClient, params.entryPointAddress);
        }
        throw new Error("Either initCodeHash or publicClient must be provided");
    })();
    let salt;
    if (entryPointVersion === "v0.6") {
        salt = generateSaltForV06(params.eoaAddress, params.index);
    }
    else {
        const hookAddress = "hookAddress" in params && params.hookAddress
            ? params.hookAddress
            : viem_1.zeroAddress;
        const hookData = "hookData" in params && params.hookData ? params.hookData : "0x";
        salt = generateSaltForV07(params.eoaAddress, params.index, hookAddress, hookData);
    }
    const factoryAddress = entryPointVersion === "v0.6"
        ? sdk_1.KERNEL_ADDRESSES.FACTORY_ADDRESS_V0_6
        : sdk_1.KERNEL_ADDRESSES.FACTORY_ADDRESS_V0_7;
    return (0, viem_1.getContractAddress)({
        bytecodeHash,
        opcode: "CREATE2",
        from: factoryAddress,
        salt
    });
}
exports.getKernelAddressFromECDSA = getKernelAddressFromECDSA;
//# sourceMappingURL=getAddress.js.map