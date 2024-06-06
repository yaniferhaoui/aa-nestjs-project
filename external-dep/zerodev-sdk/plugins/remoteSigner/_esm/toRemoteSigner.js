import { fixSignedData } from "@zerodev/sdk";
import { SignTransactionNotSupportedBySmartAccount } from "permissionless/accounts";
import { getTypesForEIP712Domain, hashTypedData, validateTypedData } from "viem";
import { toAccount } from "viem/accounts";
export var RemoteSignerMode;
(function (RemoteSignerMode) {
    RemoteSignerMode["Create"] = "create";
    RemoteSignerMode["Get"] = "get";
})(RemoteSignerMode || (RemoteSignerMode = {}));
export async function toRemoteSigner({ apiKey, keyAddress, remoteKeyStorageUrl = "https://keys.zerodev.app/wallet/v1", mode = RemoteSignerMode.Get }) {
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
    const account = toAccount({
        address: keyAddress,
        async signMessage({ message }) {
            return fixSignedData(await signMessageWithRemoteSigner(message));
        },
        async signTransaction(_, __) {
            throw new SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            const { domain, message, primaryType } = typedData;
            const types = {
                EIP712Domain: getTypesForEIP712Domain({ domain }),
                ...typedData.types
            };
            validateTypedData({ domain, message, primaryType, types });
            const hash = hashTypedData(typedData);
            return fixSignedData(await signMessageWithRemoteSigner(hash));
        }
    });
    return account;
}
//# sourceMappingURL=toRemoteSigner.js.map