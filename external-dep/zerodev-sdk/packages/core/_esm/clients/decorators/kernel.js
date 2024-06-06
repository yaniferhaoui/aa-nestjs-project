import { smartAccountActions } from "permissionless";
import { getUserOperationGasPrice } from "../../actions/account-client/getUserOperationGasPrice.js";
import {} from "../../actions/index.js";
import { prepareUserOperation, signUserOperation } from "../../actions/index.js";
import { estimateGasInERC20 } from "../../actions/paymaster/estimateGasInERC20.js";
import { sponsorUserOperation } from "../../actions/paymaster/sponsorUserOperation.js";
export const zerodevPaymasterActions = (entryPointAddress) => (client) => ({
    sponsorUserOperation: async (args) => sponsorUserOperation(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    estimateGasInERC20: async (args) => estimateGasInERC20(client, args)
});
export function kernelAccountClientActions({ middleware }) {
    return (client) => ({
        ...smartAccountActions({ middleware })(client),
        signUserOperation: (args) => signUserOperation(client, {
            ...args,
            middleware
        }),
        prepareUserOperation: (args) => prepareUserOperation(client, {
            ...args,
            middleware
        }),
        getUserOperationGasPrice: async () => getUserOperationGasPrice(client)
    });
}
//# sourceMappingURL=kernel.js.map