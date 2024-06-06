"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRemoteSigner = exports.RemoteSignerMode = void 0;
const sdk_1 = require("@zerodev/sdk");
const accounts_1 = require("permissionless/accounts");
const viem_1 = require("viem");
const accounts_2 = require("viem/accounts");
var RemoteSignerMode;
(function (RemoteSignerMode) {
    RemoteSignerMode["Create"] = "create";
    RemoteSignerMode["Get"] = "get";
})(RemoteSignerMode || (exports.RemoteSignerMode = RemoteSignerMode = {}));
async function toRemoteSigner({ apiKey, keyAddress, remoteKeyStorageUrl = "https://keys.zerodev.app/wallet/v1", mode = RemoteSignerMode.Get }) {
    if (mode === RemoteSignerMode.Create) {
        try {
            const response = await fetch(`${remoteKeyStorageUrl}/key-pair`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                }
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Request failed with status code ${response.status}: ${errorBody.message}`);
            }
            const createWalletResult = await response.json();
            keyAddress = createWalletResult.walletAddress;
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "An unknown error occurred";
            throw new Error(`An unexpected error occurred: ${errorMessage}`);
        }
    }
    if (!keyAddress) {
        throw new Error("Wallet address should be provided on get mode");
    }
    const signMessageWithRemoteSigner = async (message) => {
        try {
            const response = await fetch(`${remoteKeyStorageUrl}/sign-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify({
                    keyAddress,
                    message
                })
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Request failed with status code ${response.status}: ${errorBody.message || "An unknown error occurred"}`);
            }
            const signMessageResult = await response.json();
            return signMessageResult.signature;
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "An unknown error occurred";
            throw new Error(`An unexpected error occurred: ${errorMessage}`);
        }
    };
    const account = (0, accounts_2.toAccount)({
        address: keyAddress,
        async signMessage({ message }) {
            return (0, sdk_1.fixSignedData)(await signMessageWithRemoteSigner(message));
        },
        async signTransaction(_, __) {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            const { domain, message, primaryType } = typedData;
            const types = {
                EIP712Domain: (0, viem_1.getTypesForEIP712Domain)({ domain }),
                ...typedData.types
            };
            (0, viem_1.validateTypedData)({ domain, message, primaryType, types });
            const hash = (0, viem_1.hashTypedData)(typedData);
            return (0, sdk_1.fixSignedData)(await signMessageWithRemoteSigner(hash));
        }
    });
    return account;
}
exports.toRemoteSigner = toRemoteSigner;
//# sourceMappingURL=toRemoteSigner.js.map