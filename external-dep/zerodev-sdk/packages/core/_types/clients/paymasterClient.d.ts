import type { EntryPoint } from "permissionless/types/entrypoint";
import { type Account, type Chain, type Client, type PublicClientConfig, type Transport } from "viem";
import type { ZeroDevPaymasterRpcSchema } from "../types/kernel.js";
import { type ZeroDevPaymasterClientActions } from "./decorators/kernel.js";
export type ZeroDevPaymasterClient<entryPoint extends EntryPoint> = Client<Transport, Chain | undefined, Account | undefined, ZeroDevPaymasterRpcSchema<entryPoint>, ZeroDevPaymasterClientActions<entryPoint>>;
/**
 * Creates a ZeroDev-specific Paymaster Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * - Docs: https://docs.zerodev.app/meta-infra/getting-started/intro
 *
 * @param config - {@link PublicClientConfig}
 * @returns A ZeroDev Paymaster Client. {@link ZeroDevPaymasterClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const zerodevPaymasterClient = createZeroDevPaymasterClient({
 *   chain: mainnet,
 *   transport: http(`https://rpc.zerodev.app/api/v2/paymaster/${projectId}`),
 * })
 */
export declare const createZeroDevPaymasterClient: <entryPoint extends EntryPoint, transport extends Transport, chain extends Chain | undefined = undefined>(parameters: {
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime?: number | undefined;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain?: Chain | chain | undefined;
    key?: string | undefined;
    name?: string | undefined;
    pollingInterval?: number | undefined;
    transport: transport;
    rpcSchema?: undefined;
} & {
    entryPoint: entryPoint;
}) => ZeroDevPaymasterClient<entryPoint>;
//# sourceMappingURL=paymasterClient.d.ts.map