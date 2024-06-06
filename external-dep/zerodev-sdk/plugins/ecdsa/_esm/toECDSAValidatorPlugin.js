import { getEntryPointVersion, getUserOperationHash } from "permissionless";
import { SignTransactionNotSupportedBySmartAccount } from "permissionless/accounts";
import { toAccount } from "viem/accounts";
import { signMessage, signTypedData } from "viem/actions";
import { getChainId } from "viem/actions";
import { ECDSA_VALIDATOR_ADDRESS_V06, ECDSA_VALIDATOR_ADDRESS_V07 } from "./constants.js";
export const getValidatorAddress = (entryPointAddress) => {
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    return entryPointVersion === "v0.6"
        ? ECDSA_VALIDATOR_ADDRESS_V06
        : ECDSA_VALIDATOR_ADDRESS_V07;
};
export async function signerToEcdsaValidator(client, { signer, entryPoint: entryPointAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? getValidatorAddress(entryPointAddress);
    // Get the private key related account
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new SignTransactionNotSupportedBySmartAccount();
        }
    };
    // Fetch chain id
    const chainId = await getChainId(client);
    // Build the EOA Signer
    const account = toAccount({
        address: viemSigner.address,
        async signMessage({ message }) {
            return signMessage(client, { account: viemSigner, message });
        },
        async signTransaction(_, __) {
            throw new SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return signTypedData(client, {
                account: viemSigner,
                ...typedData
            });
        }
    });
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "ECDSAValidator",
        getIdentifier() {
            return validatorAddress ?? getValidatorAddress(entryPointAddress);
        },
        async getEnableData() {
            return viemSigner.address;
        },
        async getNonceKey(_accountAddress, customNonceKey) {
            if (customNonceKey) {
                return customNonceKey;
            }
            return 0n;
        },
        // Sign a user operation
        async signUserOperation(userOperation) {
            const hash = getUserOperationHash({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await signMessage(client, {
                account: viemSigner,
                message: { raw: hash }
            });
            return signature;
        },
        // Get simple dummy signature
        async getDummySignature() {
            return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
        },
        async isEnabled(_kernelAccountAddress, _selector) {
            return false;
        }
    };
}
//# sourceMappingURL=toECDSAValidatorPlugin.js.map