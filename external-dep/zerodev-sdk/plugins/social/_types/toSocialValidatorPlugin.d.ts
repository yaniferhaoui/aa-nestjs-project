import type { KernelValidator } from "@zerodev/sdk/types";
import type { EntryPoint } from "permissionless/types/entrypoint";
import type { Chain, Client, Transport } from "viem";
export declare function isAuthorized({ projectId }: {
    projectId: string;
}): Promise<boolean>;
export declare function initiateLogin({ socialProvider, oauthCallbackUrl, projectId }: {
    socialProvider: "google" | "facebook";
    oauthCallbackUrl?: string;
    projectId: string;
}): Promise<void>;
export declare function getSocialValidator<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { entryPoint: entryPointAddress, projectId }: {
    entryPoint: entryPoint;
    projectId: string;
}): Promise<KernelValidator<entryPoint, "SocialValidator">>;
export declare function logout({ projectId }: {
    projectId: string;
}): Promise<void>;
//# sourceMappingURL=toSocialValidatorPlugin.d.ts.map