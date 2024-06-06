import { prepareUserOperationRequest } from "permissionless/actions/smartAccount";
import { AccountOrClientNotFoundError, } from "permissionless/utils";
import { getAction } from "viem/utils";
export async function prepareUserOperation(client, args) {
    const { account: account_ = client.account } = args;
    if (!account_)
        throw new AccountOrClientNotFoundError();
    const userOperation = await getAction(client, (prepareUserOperationRequest), "prepareUserOperationRequest")(args);
    return userOperation;
}
//# sourceMappingURL=prepareUserOperation.js.map