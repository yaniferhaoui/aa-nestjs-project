import { defineChain } from 'viem';

export const privateGethNetwork = /*#__PURE__*/ defineChain({
  id: 31337,
  name: 'Private Geth Network',
  nativeCurrency: { name: 'Local Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'http://127.0.0.1/',
      apiUrl: 'http://127.0.0.1/api',
    },
  },
  contracts: {},
  testnet: true,
});

export const privateAnvilNetwork = /*#__PURE__*/ defineChain({
  id: 31337,
  name: 'Private Anvil Network',
  nativeCurrency: { name: 'Local Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'http://127.0.0.1/',
      apiUrl: 'http://127.0.0.1/api',
    },
  },
  contracts: {},
  testnet: true,
});
