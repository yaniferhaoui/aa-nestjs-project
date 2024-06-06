export declare const ModularPermissionValidatorAbi: readonly [{
    readonly inputs: readonly [];
    readonly name: "NotImplemented";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "nonce";
        readonly type: "uint256";
    }];
    readonly name: "NonceRevoked";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "PermissionRegistered";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "PermissionRevoked";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "disable";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "enable";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes12";
        readonly name: "flag";
        readonly type: "bytes12";
    }, {
        readonly internalType: "contract ISigner";
        readonly name: "signer";
        readonly type: "address";
    }, {
        readonly internalType: "ValidAfter";
        readonly name: "validAfter";
        readonly type: "uint48";
    }, {
        readonly internalType: "ValidUntil";
        readonly name: "validUntil";
        readonly type: "uint48";
    }, {
        readonly internalType: "PolicyConfig[]";
        readonly name: "_policyConfig";
        readonly type: "bytes32[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "signerData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "policyData";
        readonly type: "bytes[]";
    }];
    readonly name: "getPermissionId";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "PolicyConfig";
        readonly name: "policy";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }];
    readonly name: "nextPolicy";
    readonly outputs: readonly [{
        readonly internalType: "PolicyConfig";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }];
    readonly name: "nonces";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "lastNonce";
        readonly type: "uint128";
    }, {
        readonly internalType: "uint128";
        readonly name: "revoked";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "parseData";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "nonce";
        readonly type: "uint128";
    }, {
        readonly internalType: "bytes12";
        readonly name: "flag";
        readonly type: "bytes12";
    }, {
        readonly internalType: "contract ISigner";
        readonly name: "signer";
        readonly type: "address";
    }, {
        readonly internalType: "ValidAfter";
        readonly name: "validAfter";
        readonly type: "uint48";
    }, {
        readonly internalType: "ValidUntil";
        readonly name: "validUntil";
        readonly type: "uint48";
    }, {
        readonly internalType: "PolicyConfig[]";
        readonly name: "policies";
        readonly type: "bytes32[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "signerData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "policyData";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "kernel";
        readonly type: "address";
    }];
    readonly name: "permissions";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "nonce";
        readonly type: "uint128";
    }, {
        readonly internalType: "bytes12";
        readonly name: "flag";
        readonly type: "bytes12";
    }, {
        readonly internalType: "contract ISigner";
        readonly name: "signer";
        readonly type: "address";
    }, {
        readonly internalType: "PolicyConfig";
        readonly name: "firstPolicy";
        readonly type: "bytes32";
    }, {
        readonly internalType: "ValidAfter";
        readonly name: "validAfter";
        readonly type: "uint48";
    }, {
        readonly internalType: "ValidUntil";
        readonly name: "validUntil";
        readonly type: "uint48";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "priorityPermission";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "nonce";
        readonly type: "uint128";
    }, {
        readonly internalType: "bytes12";
        readonly name: "flag";
        readonly type: "bytes12";
    }, {
        readonly internalType: "contract ISigner";
        readonly name: "signer";
        readonly type: "address";
    }, {
        readonly internalType: "ValidAfter";
        readonly name: "validAfter";
        readonly type: "uint48";
    }, {
        readonly internalType: "ValidUntil";
        readonly name: "validUntil";
        readonly type: "uint48";
    }, {
        readonly internalType: "PolicyConfig[]";
        readonly name: "policy";
        readonly type: "bytes32[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "signerData";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "policyData";
        readonly type: "bytes[]";
    }];
    readonly name: "registerPermission";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "revokePermission";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "nonce";
        readonly type: "uint128";
    }];
    readonly name: "revokePermission";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "validCaller";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "hash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly name: "validateSignature";
    readonly outputs: readonly [{
        readonly internalType: "ValidationData";
        readonly name: "validationData";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "initCode";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "callData";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "callGasLimit";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "verificationGasLimit";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "preVerificationGas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxFeePerGas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxPriorityFeePerGas";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "paymasterAndData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }];
        readonly internalType: "struct UserOperation";
        readonly name: "_userOp";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_userOpHash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "validateUserOp";
    readonly outputs: readonly [{
        readonly internalType: "ValidationData";
        readonly name: "validationData";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
//# sourceMappingURL=ModularPermissionValidatorAbi.d.ts.map