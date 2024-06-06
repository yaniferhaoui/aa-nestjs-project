import { Chain } from 'viem';
import { privateAnvilNetwork, privateGethNetwork } from './private-network';
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  celo,
  celoAlfajores,
  holesky,
  linea,
  lineaGoerli,
  lineaSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  palm,
  palmTestnet,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains';
import type { Assign } from 'viem/types/utils';

export const COSIGNER_MODULE_ADDRESSES: Record<number, `0x${string}`> = {
  // TODO: Fill the cosigning modules
  // Private Networks
  1337: '0x',
  31337: '0x',

  // Testnet Networks
  421614: '0x',
  43113: '0x',
  84532: '0x',
  168587773: '0x',
  44787: '0x',
  11155111: '0x',
  17000: '0x',
  59140: '0x',
  59141: '0x',
  11155420: '0x',
  11297108099: '0x',
  80002: '0x',

  // Mainnet Networks
  42161: '0x',
  43114: '0x',
  8453: '0x',
  81457: '0x',
  42220: '0x',
  1: '0x',
  59144: '0x',
  10: '0x',
  11297108109: '0x',
  137: '0x',
};

export const CHAINS: Record<number, Chain> = {
  // TODO: Fill the cosigning modules
  // Private Networks
  1337: privateGethNetwork,
  31337: privateAnvilNetwork,

  // Testnet Networks
  421614: arbitrumSepolia,
  43113: avalancheFuji,
  84532: baseSepolia as Assign<Chain<undefined>, Chain>,
  168587773: blastSepolia,
  44787: celoAlfajores as Assign<Chain<undefined>, Chain>,
  11155111: sepolia,
  17000: holesky,
  59140: lineaGoerli,
  59141: lineaSepolia,
  11155420: optimismSepolia as Assign<Chain<undefined>, Chain>,
  11297108099: palmTestnet,
  80002: polygonAmoy,

  // Mainnet Networks
  42161: arbitrum,
  43114: avalanche,
  8453: base as Assign<Chain<undefined>, Chain>,
  81457: blast,
  42220: celo as Assign<Chain<undefined>, Chain>,
  1: mainnet,
  59144: linea,
  10: optimism as Assign<Chain<undefined>, Chain>,
  11297108109: palm,
  137: polygon,
};

export const getRpcUrl = (chainId: number, infuraApiKey: string) => {
  const rpcUrl = RPC_BASE_URLS[chainId];
  if (rpcUrl.includes(INFURA_API_KEY_PLACEHOLDER)) {
    return rpcUrl.replace(INFURA_API_KEY_PLACEHOLDER, infuraApiKey);
  }
  return rpcUrl;
};

const INFURA_API_KEY_PLACEHOLDER = '{API_KEY}';

const RPC_BASE_URLS: Record<number, string> = {
  // Private Networks
  1337: 'http://localhost:8545',
  31337: 'http://localhost:8545',

  // Testnet Networks
  421614: 'https://arbitrum-sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  43113: 'https://avalanche-fuji.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  84532: 'https://base-sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  168587773: 'https://blast-sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  44787: 'https://celo-alfajores.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  11155111: 'https://sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  17000: 'https://holesky.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  59140: 'https://linea-goerli.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  59141: 'https://linea-sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  11155420:
    'https://optimism-sepolia.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  11297108099:
    'https://palm-testnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  80002: 'https://polygon-amoy.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,

  // Mainnet Networks
  42161: 'https://arbitrum-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  43114: 'https://avalanche-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  8453: 'https://base-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  81457: 'https://blast-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  42220: 'https://celo-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  1: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  59144: 'https://linea-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  10: 'https://optimism-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  11297108109:
    'https://palm-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
  137: 'https://polygon-mainnet.infura.io/v3/' + INFURA_API_KEY_PLACEHOLDER,
};
