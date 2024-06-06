"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKernelV1Account = void 0;
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
const actions_1 = require("viem/actions");
const _6492_js_1 = require("../../utils/6492.js");
const index_js_1 = require("../../utils/index.js");
const multisend_js_1 = require("../../utils/multisend.js");
const createAccountAbi = [
    {
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "uint256", name: "_index", type: "uint256" }
        ],
        name: "createAccount",
        outputs: [
            {
                internalType: "contract EIP1967Proxy",
                name: "proxy",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    }
];
const executeAndRevertAbi = [
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
            { internalType: "enum Operation", name: "operation", type: "uint8" }
        ],
        name: "executeAndRevert",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];
const KERNEL_V1_ADDRESSES = {
    FACTORY_ADDRESS: "0x4E4946298614FC299B50c947289F4aD0572CB9ce",
    ENTRYPOINT_V0_6: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
};
async function createKernelV1Account(client, { signer, entrypoint: entryPointAddress, index = 0n }) {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6" ||
        entryPointAddress !== permissionless_1.ENTRYPOINT_ADDRESS_V06) {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const chainId = await (0, actions_1.getChainId)(client);
    const generateInitCode = async () => {
        return (0, viem_1.concatHex)([
            KERNEL_V1_ADDRESSES.FACTORY_ADDRESS,
            (0, viem_1.encodeFunctionData)({
                abi: createAccountAbi,
                functionName: "createAccount",
                args: [signer.address, index]
            })
        ]);
    };
    const initCode = await generateInitCode();
    const accountAddress = await (0, permissionless_1.getSenderAddress)(client, {
        initCode,
        entryPoint: entryPointAddress
    });
    if (!accountAddress)
        throw new Error("Account address not found");
    let smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
    const account = (0, accounts_2.toAccount)({
        address: accountAddress,
        async signMessage({ message }) {
            const [isDeployed, signature] = await Promise.all([
                (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress),
                signer.signMessage({ message })
            ]);
            return create6492Signature(isDeployed, signature);
        },
        async signTransaction(_, __) {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return (0, actions_1.signTypedData)(client, {
                account: viemSigner,
                ...typedData
            });
        }
    });
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
        generateInitCode,
        encodeModuleInstallCallData: async () => {
            throw new Error("Not implemented");
        },
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "kernelSmartAccount",
        async getFactory() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return KERNEL_V1_ADDRESSES.FACTORY_ADDRESS;
        },
        async getFactoryData() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return (0, index_js_1.parseFactoryAddressAndCallDataFromAccountInitCode)(await generateInitCode())[1];
        },
        async getNonce() {
            return (0, permissionless_1.getAccountNonce)(client, {
                sender: accountAddress,
                entryPoint: entryPointAddress
            });
        },
        async signUserOperation(userOperation) {
            const hash = (0, permissionless_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message: { raw: hash }
            });
            return signature;
        },
        async getInitCode() {
            if (smartAccountDeployed)
                return "0x";
            smartAccountDeployed = await (0, permissionless_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return "0x";
            return generateInitCode();
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
                    abi: executeAndRevertAbi,
                    functionName: "executeAndRevert",
                    args: [multisend_js_1.MULTISEND_ADDRESS, 0n, multiSendCallData, 1n]
                });
            }
            if (!tx.callType || tx.callType === "call") {
                if (tx.to.toLowerCase() === accountAddress.toLowerCase()) {
                    return tx.data;
                }
                return (0, viem_1.encodeFunctionData)({
                    abi: executeAndRevertAbi,
                    functionName: "executeAndRevert",
                    args: [tx.to, tx.value || 0n, tx.data, 0n]
                });
            }
            if (tx.callType === "delegatecall") {
                return (0, viem_1.encodeFunctionData)({
                    abi: executeAndRevertAbi,
                    functionName: "executeAndRevert",
                    args: [tx.to, tx.value || 0n, tx.data, 1n]
                });
            }
            throw new Error("Invalid call type");
        },
        async encodeDeployCallData() {
            return "0x";
        },
        async getDummySignature() {
            return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
        }
    };
}
exports.createKernelV1Account = createKernelV1Account;
//# sourceMappingURL=createKernelV1Account.js.map