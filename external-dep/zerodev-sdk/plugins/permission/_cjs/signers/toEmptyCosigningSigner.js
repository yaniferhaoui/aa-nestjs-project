"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEmptyCosigningSigner = void 0;
const sdk_1 = require("@zerodev/sdk");
const accounts_1 = require("viem/accounts");
function toEmptyCosigningSigner({ signerAddress, signerContractAddress }) {
    const account = (0, accounts_1.toAccount)({
        address: signerAddress,
        async signMessage() {
            throw new Error("Method not supported");
        },
        async signTransaction(_, __) {
            throw new Error("Method not supported");
        },
        async signTypedData(_typedData) {
            throw new Error("Method not supported");
        }
    });
    return {
        account,
        signerContractAddress: signerContractAddress,
        getSignerData: () => {
            return signerAddress;
        },
        getDummySignature: () => sdk_1.constants.DUMMY_ECDSA_SIG
    };
}
exports.toEmptyCosigningSigner = toEmptyCosigningSigner;
//# sourceMappingURL=toEmptyCosigningSigner.js.map