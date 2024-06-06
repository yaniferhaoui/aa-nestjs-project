import type { WebAuthnKey } from "./toWebAuthnSigner.js";
export declare enum WebAuthnMode {
    Register = "register",
    Login = "login"
}
export declare const toWebAuthnPubKey: ({ passkeyName, passkeyServerUrl, mode }: {
    passkeyName: string;
    passkeyServerUrl: string;
    mode: WebAuthnMode;
}) => Promise<WebAuthnKey>;
//# sourceMappingURL=toWebAuthnPubKey.d.ts.map