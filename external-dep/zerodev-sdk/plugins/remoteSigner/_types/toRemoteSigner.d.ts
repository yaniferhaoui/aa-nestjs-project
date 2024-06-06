import { type Hex, type LocalAccount } from "viem";
export declare enum RemoteSignerMode {
    Create = "create",
    Get = "get"
}
export type RemoteSignerParams = {
    apiKey: string;
    keyAddress?: Hex;
    remoteKeyStorageUrl?: string;
    mode?: RemoteSignerMode;
};
export declare function toRemoteSigner({ apiKey, keyAddress, remoteKeyStorageUrl, mode }: RemoteSignerParams): Promise<LocalAccount>;
//# sourceMappingURL=toRemoteSigner.d.ts.map