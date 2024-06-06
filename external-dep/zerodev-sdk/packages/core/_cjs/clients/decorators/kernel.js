"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kernelAccountClientActions = exports.zerodevPaymasterActions = void 0;
const permissionless_1 = require("permissionless");
const getUserOperationGasPrice_js_1 = require("../../actions/account-client/getUserOperationGasPrice.js");
const index_js_1 = require("../../actions/index.js");
const estimateGasInERC20_js_1 = require("../../actions/paymaster/estimateGasInERC20.js");
const sponsorUserOperation_js_1 = require("../../actions/paymaster/sponsorUserOperation.js");
const zerodevPaymasterActions = (entryPointAddress) => (client) => ({
    sponsorUserOperation: async (args) => (0, sponsorUserOperation_js_1.sponsorUserOperation)(client, {
        ...args,
        entryPoint: entryPointAddress
    }),
    estimateGasInERC20: async (args) => (0, estimateGasInERC20_js_1.estimateGasInERC20)(client, args)
});
exports.zerodevPaymasterActions = zerodevPaymasterActions;
function kernelAccountClientActions({ middleware }) {
    return (client) => ({
        ...(0, permissionless_1.smartAccountActions)({ middleware })(client),
        signUserOperation: (args) => (0, index_js_1.signUserOperation)(client, {
            ...args,
            middleware
        }),
        prepareUserOperation: (args) => (0, index_js_1.prepareUserOperation)(client, {
            ...args,
            middleware
        }),
        getUserOperationGasPrice: async () => (0, getUserOperationGasPrice_js_1.getUserOperationGasPrice)(client)
    });
}
exports.kernelAccountClientActions = kernelAccountClientActions;
//# sourceMappingURL=kernel.js.map