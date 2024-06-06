"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCosigningSigner = void 0;
const sdk_1 = require("@zerodev/sdk");
const accounts_1 = require("permissionless/accounts");
const accounts_2 = require("viem/accounts");
function toCosigningSigner({ signer, signerContractAddress }) {
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const account = (0, accounts_2.toAccount)({
        address: viemSigner.address,
        async signMessage({ message }) {
            return (0, sdk_1.fixSignedData)(await viemSigner.signMessage({ message }));
        },
        async signTransaction(_, __) {
            throw new accounts_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return (0, sdk_1.fixSignedData)(await viemSigner.signTypedData({
                ...typedData
            }));
        }
    });
    return {
        account,
        signerContractAddress: signerContractAddress,
        getSignerData: () => {
            return viemSigner.address;
        },
        getDummySignature: () => sdk_1.constants.DUMMY_ECDSA_SIG
    };
}
exports.toCosigningSigner = toCosigningSigner;
//# sourceMappingURL=toCosigningSigner.js.map