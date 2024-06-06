"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKernelAccount = exports.KERNEL_ADDRESSES = void 0;
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const utils_js_1 = require("../../utils.js");
const index_js_1 = require("../utils/index.js");
const toKernelPluginManager_js_1 = require("../utils/toKernelPluginManager.js");
const KernelAccountAbi_js_1 = require("./abi/KernelAccountAbi.js");
const KernelAccountAbi_js_2 = require("./abi/kernel_v_3_0_0/KernelAccountAbi.js");
const KernelFactoryStakerAbi_js_1 = require("./abi/kernel_v_3_0_0/KernelFactoryStakerAbi.js");
const encodeCallData_js_1 = require("./utils/account/ep0_6/encodeCallData.js");
const encodeDeployCallData_js_1 = require("./utils/account/ep0_6/encodeDeployCallData.js");
const encodeCallData_js_2 = require("./utils/account/ep0_7/encodeCallData.js");
const encodeDeployCallData_js_2 = require("./utils/account/ep0_7/encodeDeployCallData.js");
const accountMetadata_js_1 = require("./utils/common/accountMetadata.js");
const eip712WrapHash_js_1 = require("./utils/common/eip712WrapHash.js");
const createAccountAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_implementation",
                type: "address"
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes"
            },
            {
                internalType: "uint256",
                name: "_index",
                type: "uint256"
            }
        ],
        name: "createAccount",
        outputs: [
            {
                internalType: "address",
                name: "proxy",
                type: "address"
            }
        ],
        stateMutability: "payable",
        type: "function"
    }
];
exports.KERNEL_ADDRESSES = {
    ACCOUNT_LOGIC_V0_6: "0xd3082872F8B06073A021b4602e022d5A070d7cfC",
    ACCOUNT_LOGIC_V0_7: "0x94F097E1ebEB4ecA3AAE54cabb08905B239A7D27",
    FACTORY_ADDRESS_V0_6: "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3",
    FACTORY_ADDRESS_V0_7: "0x6723b44Abeec4E71eBE3232BD5B455805baDD22f",
    FACTORY_STAKER: "0xd703aaE79538628d27099B8c4f621bE4CCd142d5"
};
const getKernelInitData = async ({ entryPoint: entryPointAddress, kernelPluginManager }) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    const { enableData, identifier, validatorAddress } = await kernelPluginManager.getValidatorInitData();
    if (entryPointVersion === "v0.6") {
        return (0, viem_1.encodeFunctionData)({
            abi: KernelAccountAbi_js_1.KernelInitAbi,
            functionName: "initialize",
            args: [validatorAddress, enableData]
        });
    }
    return (0, viem_1.encodeFunctionData)({
        abi: KernelAccountAbi_js_2.KernelV3InitAbi,
        functionName: "initialize",
        args: [identifier, viem_1.zeroAddress, enableData, "0x"]
    });
};
const getAccountInitCode = async ({ index, factoryAddress, accountLogicAddress, factoryStakerAddress, entryPoint: entryPointAddress, kernelPluginManager }) => {
    const initialisationData = await getKernelInitData({
        entryPoint: entryPointAddress,
        kernelPluginManager
    });
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion === "v0.6") {
        return (0, viem_1.concatHex)([
            factoryAddress,
            (0, viem_1.encodeFunctionData)({
                abi: createAccountAbi,
                functionName: "createAccount",
                args: [accountLogicAddress, initialisationData, index]
            })
        ]);
    }
    return (0, viem_1.concatHex)([
        factoryStakerAddress,
        (0, viem_1.encodeFunctionData)({
            abi: KernelFactoryStakerAbi_js_1.KernelFactoryStakerAbi,
            functionName: "deployWithFactory",
            args: [
                factoryAddress,
                initialisationData,
                (0, viem_1.toHex)(index, { size: 32 })
            ]
        })
    ]);
};
const getAccountAddress = async ({ client, entryPoint: entryPointAddress, initCodeProvider }) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    const initCode = await initCodeProvider();
    if (entryPointVersion === "v0.6") {
        return (0, permissionless_1.getSenderAddress)(client, {
            initCode,
            entryPoint: entryPointAddress
        });
    }
    return (0, permissionless_1.getSenderAddress)(client, {
        factory: (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(initCode)[0],
        factoryData: (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(initCode)[1],
        entryPoint: entryPointAddress
    });
};
async function createKernelAccount(client, { plugins, entryPoint: entryPointAddress, index = 0n, factoryAddress, accountLogicAddress, factoryStakerAddress = exports.KERNEL_ADDRESSES.FACTORY_STAKER, deployedAccountAddress }) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    accountLogicAddress =
        accountLogicAddress ??
            (entryPointVersion === "v0.6"
                ? exports.KERNEL_ADDRESSES.ACCOUNT_LOGIC_V0_6
                : exports.KERNEL_ADDRESSES.ACCOUNT_LOGIC_V0_7);
    factoryAddress =
        factoryAddress ??
            (entryPointVersion === "v0.6"
                ? exports.KERNEL_ADDRESSES.FACTORY_ADDRESS_V0_6
                : exports.KERNEL_ADDRESSES.FACTORY_ADDRESS_V0_7);
    const kernelPluginManager = (0, toKernelPluginManager_js_1.isKernelPluginManager)(plugins)
        ? plugins
        : await (0, toKernelPluginManager_js_1.toKernelPluginManager)(client, {
            sudo: plugins.sudo,
            regular: plugins.regular,
            action: plugins.action,
            pluginEnableSignature: plugins.pluginEnableSignature,
            entryPoint: entryPointAddress
        });
    const generateInitCode = async () => {
        if (!accountLogicAddress || !factoryAddress)
            throw new Error("Missing account logic address or factory address");
        return getAccountInitCode({
            index,
            factoryAddress,
            accountLogicAddress,
            factoryStakerAddress,
            entryPoint: entryPointAddress,
            kernelPluginManager
        });
    };
    const accountAddress = deployedAccountAddress ??
        (await getAccountAddress({
            client,
            entryPoint: entryPointAddress,
            initCodeProvider: generateInitCode
        }));
    if (!accountAddress)
        throw new Error("Account address not found");
    let smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
    return {
        kernelPluginManager,
        generateInitCode,
        encodeModuleInstallCallData: async () => {
            return await kernelPluginManager.encodeModuleInstallCallData(accountAddress);
        },
        ...(0, accounts_1.toSmartAccount)({
            address: accountAddress,
            publicKey: accountAddress,
            source: "kernelSmartAccount",
            client,
            entryPoint: entryPointAddress,
            async encodeDeployCallData(_tx) {
                if (entryPointVersion === "v0.6") {
                    return (0, encodeDeployCallData_js_1.encodeDeployCallData)(_tx);
                }
                return (0, encodeDeployCallData_js_2.encodeDeployCallData)(_tx);
            },
            async encodeCallData(_tx) {
                const tx = _tx;
                if (!Array.isArray(tx) &&
                    (!tx.callType || tx.callType === "call") &&
                    tx.to.toLowerCase() === accountAddress.toLowerCase()) {
                    return tx.data;
                }
                if (entryPointVersion === "v0.6") {
                    return (0, encodeCallData_js_1.encodeCallData)(tx);
                }
                return (0, encodeCallData_js_2.encodeCallData)(tx);
            },
            async getFactory() {
                if (smartAccountDeployed)
                    return undefined;
                smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
                if (smartAccountDeployed)
                    return undefined;
                const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
                return entryPointVersion === "v0.6"
                    ? factoryAddress
                    : factoryStakerAddress;
            },
            async getFactoryData() {
                if (smartAccountDeployed)
                    return undefined;
                smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
                if (smartAccountDeployed)
                    return undefined;
                return (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(await generateInitCode())[1];
            },
            async signMessage({ message }) {
                const messageHash = (0, viem_1.hashMessage)(message);
                const { name, chainId, version } = await (0, accountMetadata_js_1.accountMetadata)(client, accountAddress, entryPointAddress);
                const wrappedMessageHash = await (0, eip712WrapHash_js_1.eip712WrapHash)(messageHash, {
                    name,
                    chainId: Number(chainId),
                    version,
                    verifyingContract: accountAddress
                });
                const signature = await kernelPluginManager.signMessage({
                    message: { raw: wrappedMessageHash }
                });
                if (!(0, utils_js_1.hasKernelFeature)(utils_js_1.KERNEL_FEATURES.ERC1271_WITH_VALIDATOR, version)) {
                    return signature;
                }
                return (0, viem_1.concatHex)([
                    kernelPluginManager.getIdentifier(),
                    signature
                ]);
            },
            async signTransaction(_, __) {
                throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
            },
            async signTypedData(typedData) {
                const types = {
                    EIP712Domain: (0, viem_1.getTypesForEIP712Domain)({
                        domain: typedData.domain
                    }),
                    ...typedData.types
                };
                (0, viem_1.validateTypedData)({
                    domain: typedData.domain,
                    message: typedData.message,
                    primaryType: typedData.primaryType,
                    types: types
                });
                const typedHash = (0, viem_1.hashTypedData)(typedData);
                const { name, chainId, version } = await (0, accountMetadata_js_1.accountMetadata)(client, accountAddress, entryPointAddress);
                const wrappedMessageHash = await (0, eip712WrapHash_js_1.eip712WrapHash)(typedHash, {
                    name,
                    chainId: Number(chainId),
                    version,
                    verifyingContract: accountAddress
                });
                const signature = await kernelPluginManager.signMessage({
                    message: { raw: wrappedMessageHash }
                });
                if (!(0, utils_js_1.hasKernelFeature)(utils_js_1.KERNEL_FEATURES.ERC1271_WITH_VALIDATOR, version)) {
                    return signature;
                }
                return (0, viem_1.concatHex)([
                    kernelPluginManager.getIdentifier(),
                    signature
                ]);
            },
            async getNonce(customNonceKey) {
                const key = await kernelPluginManager.getNonceKey(accountAddress, customNonceKey);
                return (0, permissionless_1.getAccountNonce)(client, {
                    sender: accountAddress,
                    entryPoint: entryPointAddress,
                    key
                });
            },
            async signUserOperation(userOperation) {
                return kernelPluginManager.signUserOperation(userOperation);
            },
            async getDummySignature(userOperation) {
                return kernelPluginManager.getDummySignature(userOperation);
            },
            async getInitCode() {
                if (smartAccountDeployed)
                    return "0x";
                smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
                if (smartAccountDeployed)
                    return "0x";
                return generateInitCode();
            }
        })
    };
}
exports.createKernelAccount = createKernelAccount;
//# sourceMappingURL=createKernelAccount.js.map