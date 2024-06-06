import { constants } from "@zerodev/sdk";
import { toAccount } from "viem/accounts";
export function toEmptyCosigningSigner({ signerAddress, signerContractAddress }) {
    const account = toAccount({
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
        getDummySignature: () => constants.DUMMY_ECDSA_SIG
    };
}
//# sourceMappingURL=toEmptyCosigningSigner.js.map