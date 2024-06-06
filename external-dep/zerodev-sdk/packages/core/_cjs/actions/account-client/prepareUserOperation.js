"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUserOperation = void 0;
const smartAccount_1 = require("permissionless/actions/smartAccount");
const utils_1 = require("permissionless/utils");
const utils_2 = require("viem/utils");
async function prepareUserOperation(client, args) {
    const { account: account_ = client.account } = args;
    if (!account_)
        throw new utils_1.AccountOrClientNotFoundError();
    const userOperation = await (0, utils_2.getAction)(client, (smartAccount_1.prepareUserOperationRequest), "prepareUserOperationRequest")(args);
    return userOperation;
}
exports.prepareUserOperation = prepareUserOperation;
//# sourceMappingURL=prepareUserOperation.js.map