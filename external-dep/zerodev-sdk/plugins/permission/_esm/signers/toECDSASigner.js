import { constants, fixSignedData } from "@zerodev/sdk";
import { SignTransactionNotSupportedBySmartAccount } from "permissionless/accounts";
import { toAccount } from "viem/accounts";
import { ECDSA_SIGNER_CONTRACT } from "../constants.js";
export function toECDSASigner({ signer, signerContractAddress = ECDSA_SIGNER_CONTRACT }) {
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new SignTransactionNotSupportedBySmartAccount();
        }
    };
    const account = toAccount({
        address: viemSigner.address,
        async signMessage({ message }) {
            return fixSignedData(await viemSigner.signMessage({ message }));
        },
        async signTransaction(_, __) {
            throw new SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return fixSignedData(await viemSigner.signTypedData({
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
        getDummySignature: () => constants.DUMMY_ECDSA_SIG
    };
}
//# sourceMappingURL=toECDSASigner.js.map