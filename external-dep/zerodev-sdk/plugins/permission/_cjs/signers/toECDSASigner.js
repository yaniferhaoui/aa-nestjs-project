"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toECDSASigner = void 0;
const sdk_1 = require("@zerodev/sdk");
const accounts_1 = require("permissionless/accounts");
const accounts_2 = require("viem/accounts");
const constants_js_1 = require("../constants.js");
function toECDSASigner({ signer, signerContractAddress = constants_js_1.ECDSA_SIGNER_CONTRACT }) {
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
        signerContractAddress,
        getSignerData: () => {
            return viemSigner.address;
        },
        getDummySignature: () => sdk_1.constants.DUMMY_ECDSA_SIG
    };
}
exports.toECDSASigner = toECDSASigner;
//# sourceMappingURL=toECDSASigner.js.map