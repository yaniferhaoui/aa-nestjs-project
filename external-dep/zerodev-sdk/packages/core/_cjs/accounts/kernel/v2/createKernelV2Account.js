"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKernelV2Account = exports.KERNEL_ADDRESSES = void 0;
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const _6492_js_1 = require("../../utils/6492.js");
const index_js_1 = require("../../utils/index.js");
const multisend_js_1 = require("../../utils/multisend.js");
const toKernelPluginManager_js_1 = require("../../utils/toKernelPluginManager.js");
const KernelAccountV2Abi_js_1 = require("./abi/KernelAccountV2Abi.js");
const KernelFactoryV2Abi_js_1 = require("./abi/KernelFactoryV2Abi.js");
const createCallAddress = "0x9b35Af71d77eaf8d7e40252370304687390A1A52";
const createCallAbi = (0, viem_1.parseAbi)([
    "function performCreate(uint256 value, bytes memory deploymentData) public returns (address newContract)",
    "function performCreate2(uint256 value, bytes memory deploymentData, bytes32 salt) public returns (address newContract)"
]);
exports.KERNEL_ADDRESSES = {
    FACTORY_ADDRESS: "0xaee9762ce625e0a8f7b184670fb57c37bfe1d0f1",
    ENTRYPOINT_V0_6: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
};
const getAccountInitCode = async ({ index, factoryAddress, validatorAddress, enableData }) => {
    return (0, viem_1.concatHex)([
        factoryAddress,
        (0, viem_1.encodeFunctionData)({
            abi: KernelFactoryV2Abi_js_1.KernelFactoryV2Abi,
            functionName: "createAccount",
            args: [validatorAddress, enableData, index]
        })
    ]);
};
const getAccountAddress = async ({ client, entryPoint: entryPointAddress, initCodeProvider }) => {
    const initCode = await initCodeProvider();
    return (0, permissionless_1.getSenderAddress)(client, {
        initCode,
        entryPoint: entryPointAddress
    });
};
async function createKernelV2Account(client, { plugins, entryPoint: entryPointAddress, index = 0n, factoryAddress = exports.KERNEL_ADDRESSES.FACTORY_ADDRESS, deployedAccountAddress }) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const kernelPluginManager = (0, toKernelPluginManager_js_1.isKernelPluginManager)(plugins)
        ? plugins
        : await (0, toKernelPluginManager_js_1.toKernelPluginManager)(client, {
            sudo: plugins.sudo,
            regular: plugins.regular,
            action: plugins.action,
            pluginEnableSignature: plugins.pluginEnableSignature,
            kernelVersion: "0.0.2" ?? plugins.kernelVersion,
            entryPoint: entryPointAddress
        });
    const generateInitCode = async () => {
        const validatorInitData = await kernelPluginManager.getValidatorInitData();
        return getAccountInitCode({
            index,
            factoryAddress,
            validatorAddress: validatorInitData.validatorAddress,
            enableData: validatorInitData.enableData
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
    const account = (0, accounts_2.toAccount)({
        address: accountAddress,
        async signMessage({ message }) {
            const messageHash = (0, viem_1.hashMessage)(message);
            const [isDeployed, signature] = await Promise.all([
                (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress),
                kernelPluginManager.signMessage({
                    message: {
                        raw: messageHash
                    }
                })
            ]);
            return create6492Signature(isDeployed, signature);
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
            const [isDeployed, signature] = await Promise.all([
                (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress),
                kernelPluginManager.signMessage({
                    message: {
                        raw: typedHash
                    }
                })
            ]);
            return create6492Signature(isDeployed, signature);
        }
    });
    let smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
    const create6492Signature = async (isDeployed, signature) => {
        if (isDeployed) {
            return signature;
        }
        const [factoryAddress, factoryCalldata] = (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(await generateInitCode());
        return (0, _6492_js_1.wrapSignatureWith6492)({
            factoryAddress,
            factoryCalldata,
            signature
        });
    };
    return {
        ...account,
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "kernelSmartAccount",
        kernelPluginManager,
        generateInitCode,
        encodeModuleInstallCallData: async () => {
            return await kernelPluginManager.encodeModuleInstallCallData(accountAddress);
        },
        async getFactory() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return factoryAddress;
        },
        async getFactoryData() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(await generateInitCode())[1];
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
        async getInitCode() {
            if (smartAccountDeployed)
                return "0x";
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return "0x";
            return generateInitCode();
        },
        async encodeDeployCallData(_tx) {
            return (0, viem_1.encodeFunctionData)({
                abi: KernelAccountV2Abi_js_1.KernelAccountV2Abi,
                functionName: "execute",
                args: [
                    createCallAddress,
                    0n,
                    (0, viem_1.encodeFunctionData)({
                        abi: createCallAbi,
                        functionName: "performCreate",
                        args: [
                            0n,
                            (0, viem_1.encodeDeployData)({
                                abi: _tx.abi,
                                bytecode: _tx.bytecode,
                                args: _tx.args
                            })
                        ]
                    }),
                    1
                ]
            });
        },
        async encodeCallData(_tx) {
            const tx = _tx;
            if (Array.isArray(tx)) {
                const multiSendCallData = (0, viem_1.encodeFunctionData)({
                    abi: multisend_js_1.multiSendAbi,
                    functionName: "multiSend",
                    args: [(0, multisend_js_1.encodeMultiSend)(tx)]
                });
                return (0, viem_1.encodeFunctionData)({
                    abi: KernelAccountV2Abi_js_1.KernelAccountV2Abi,
                    functionName: "execute",
                    args: [multisend_js_1.MULTISEND_ADDRESS, 0n, multiSendCallData, 1]
                });
            }
            if (!tx.callType || tx.callType === "call") {
                if (tx.to.toLowerCase() === accountAddress.toLowerCase()) {
                    return tx.data;
                }
                return (0, viem_1.encodeFunctionData)({
                    abi: KernelAccountV2Abi_js_1.KernelAccountV2Abi,
                    functionName: "execute",
                    args: [tx.to, tx.value, tx.data, 0]
                });
            }
            if (tx.callType === "delegatecall") {
                return (0, viem_1.encodeFunctionData)({
                    abi: KernelAccountV2Abi_js_1.KernelAccountV2Abi,
                    functionName: "execute",
                    args: [tx.to, 0n, tx.data, 1]
                });
            }
            throw new Error("Invalid call type");
        },
        async getDummySignature(userOperation) {
            return kernelPluginManager.getDummySignature(userOperation);
        }
    };
}
exports.createKernelV2Account = createKernelV2Account;
//# sourceMappingURL=createKernelV2Account.js.map