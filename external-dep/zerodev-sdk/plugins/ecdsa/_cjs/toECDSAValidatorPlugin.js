"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerToEcdsaValidator = exports.getValidatorAddress = void 0;
const permissionless_1 = require("permissionless");
const accounts_1 = require("permissionless/accounts");
const accounts_2 = require("viem/accounts");
const actions_1 = require("viem/actions");
const actions_2 = require("viem/actions");
const constants_js_1 = require("./constants.js");
const getValidatorAddress = (entryPointAddress) => {
    const entryPointVersion = (0, permissionless_1.getEntryPointVersion)(entryPointAddress);
    return entryPointVersion === "v0.6"
        ? constants_js_1.ECDSA_VALIDATOR_ADDRESS_V06
        : constants_js_1.ECDSA_VALIDATOR_ADDRESS_V07;
};
exports.getValidatorAddress = getValidatorAddress;
async function signerToEcdsaValidator(client, { signer, entryPoint: entryPointAddress, validatorAddress }) {
    validatorAddress =
        validatorAddress ?? (0, exports.getValidatorAddress)(entryPointAddress);
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const chainId = await (0, actions_2.getChainId)(client);
    const account = (0, accounts_2.toAccount)({
        address: viemSigner.address,
        async signMessage({ message }) {
            return (0, actions_1.signMessage)(client, { account: viemSigner, message });
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
    return {
        ...account,
        validatorType: "SECONDARY",
        address: validatorAddress,
        source: "ECDSAValidator",
        getIdentifier() {
            return validatorAddress ?? (0, exports.getValidatorAddress)(entryPointAddress);
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
        async getDummySignature() {
            return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
        },
        async isEnabled(_kernelAccountAddress, _selector) {
            return false;
        }
    };
}
exports.signerToEcdsaValidator = signerToEcdsaValidator;
//# sourceMappingURL=toECDSAValidatorPlugin.js.map