/**
 * @warn This abi is temporary and will be replaced by @zerodev/sdk
 */
export declare const WeightedValidatorAbi: readonly [{
    readonly type: "function";
    readonly name: "approve";
    readonly inputs: readonly [{
        readonly name: "_callDataAndNonceHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_kernel";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "approveWithSig";
    readonly inputs: readonly [{
        readonly name: "_callDataAndNonceHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_kernel";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "sigs";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disable";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "eip712Domain";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "fields";
        readonly type: "bytes1";
        readonly internalType: "bytes1";
    }, {
        readonly name: "name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "version";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "chainId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "verifyingContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "salt";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "extensions";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enable";
    readonly inputs: readonly [{
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "getApproval";
    readonly inputs: readonly [{
        readonly name: "kernel";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "approvals";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "passed";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "guardian";
    readonly inputs: readonly [{
        readonly name: "guardian";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "kernel";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "weight";
        readonly type: "uint24";
        readonly internalType: "uint24";
    }, {
        readonly name: "nextGuardian";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proposalStatus";
    readonly inputs: readonly [{
        readonly name: "callDataAndNonceHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "kernel";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "status";
        readonly type: "uint8";
        readonly internalType: "enum ProposalStatus";
    }, {
        readonly name: "validAfter";
        readonly type: "uint48";
        readonly internalType: "ValidAfter";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "renew";
    readonly inputs: readonly [{
        readonly name: "_guardians";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "_weights";
        readonly type: "uint24[]";
        readonly internalType: "uint24[]";
    }, {
        readonly name: "_threshold";
        readonly type: "uint24";
        readonly internalType: "uint24";
    }, {
        readonly name: "_delay";
        readonly type: "uint48";
        readonly internalType: "uint48";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "validCaller";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "validateSignature";
    readonly inputs: readonly [{
        readonly name: "hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "ValidationData";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "validateUserOp";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly type: "tuple";
        readonly internalType: "struct UserOperation";
        readonly components: readonly [{
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "initCode";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "signature";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "userOpHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "validationData";
        readonly type: "uint256";
        readonly internalType: "ValidationData";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "veto";
    readonly inputs: readonly [{
        readonly name: "_callDataAndNonceHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "voteStatus";
    readonly inputs: readonly [{
        readonly name: "callDataAndNonceHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "guardian";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "kernel";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "status";
        readonly type: "uint8";
        readonly internalType: "enum VoteStatus";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "weightedStorage";
    readonly inputs: readonly [{
        readonly name: "kernel";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "totalWeight";
        readonly type: "uint24";
        readonly internalType: "uint24";
    }, {
        readonly name: "threshold";
        readonly type: "uint24";
        readonly internalType: "uint24";
    }, {
        readonly name: "delay";
        readonly type: "uint48";
        readonly internalType: "uint48";
    }, {
        readonly name: "firstGuardian";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "GuardianAdded";
    readonly inputs: readonly [{
        readonly name: "guardian";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "kernel";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "weight";
        readonly type: "uint24";
        readonly indexed: false;
        readonly internalType: "uint24";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "GuardianRemoved";
    readonly inputs: readonly [{
        readonly name: "guardian";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "kernel";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "NotImplemented";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=abi.d.ts.map