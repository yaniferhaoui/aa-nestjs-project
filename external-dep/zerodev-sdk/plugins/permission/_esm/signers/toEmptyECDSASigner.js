import { constants } from "@zerodev/sdk";
import { toAccount } from "viem/accounts";
import { ECDSA_SIGNER_CONTRACT } from "../constants.js";
export function toEmptyECDSASigner(address) {
    const account = toAccount({
        address,
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
        signerContractAddress: ECDSA_SIGNER_CONTRACT,
        getSignerData: () => {
            return address;
        },
        getDummySignature: () => constants.DUMMY_ECDSA_SIG
    };
}
//# sourceMappingURL=toEmptyECDSASigner.js.map