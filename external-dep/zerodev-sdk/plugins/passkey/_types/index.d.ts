import type { KernelValidator } from "@zerodev/sdk/types";
import type { EntryPoint } from "permissionless/types/entrypoint.js";
import { createPasskeyValidator, deserializePasskeyValidator, getPasskeyValidator } from "./toPasskeyValidator.js";
export { deserializePasskeyValidator, createPasskeyValidator, getPasskeyValidator, type KernelValidator };
export declare const WEBAUTHN_VALIDATOR_ADDRESS_V06 = "0x1e02Ff20b604C2B2809193917Ea22D8602126837";
export declare const WEBAUTHN_VALIDATOR_ADDRESS_V07 = "0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06";
export declare const getValidatorAddress: (entryPointAddress: EntryPoint) => "0x1e02Ff20b604C2B2809193917Ea22D8602126837" | "0xD990393C670dCcE8b4d8F858FB98c9912dBFAa06";
//# sourceMappingURL=index.d.ts.map