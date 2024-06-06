import { getEntryPointVersion } from "permissionless";
import { createPasskeyValidator, deserializePasskeyValidator, getPasskeyValidator } from "./toPasskeyValidator.js";
export { deserializePasskeyValidator, createPasskeyValidator, getPasskeyValidator };
export const WEBAUTHN_VALIDATOR_ADDRESS_V06 = "0x1e02Ff20b604C2B2809193917Ea22D8602126837";
export const WEBAUTHN_VALIDATOR_ADDRESS_V07 = "0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06";
export const getValidatorAddress = (entryPointAddress) => {
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    return entryPointVersion === "v0.6"
        ? WEBAUTHN_VALIDATOR_ADDRESS_V06
        : WEBAUTHN_VALIDATOR_ADDRESS_V07;
};
//# sourceMappingURL=index.js.map