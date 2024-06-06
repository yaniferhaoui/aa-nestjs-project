import {} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { signerToLightSmartAccount } from "./signerToLightSmartAccount.js";
/**
 * @description Creates an Simple Account from a private key.
 *
 * @returns A Private Key Simple Account.
 */
export async function privateKeyToLightSmartAccount(client, { privateKey, ...rest }) {
    const privateKeyAccount = privateKeyToAccount(privateKey);
    return signerToLightSmartAccount(client, {
        signer: privateKeyAccount,
        ...rest
    });
}
//# sourceMappingURL=privateKeyToLightSmartAccount.js.map