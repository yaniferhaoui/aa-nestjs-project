import type { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';

export interface AppConfig {
  port: number;
  entryPoint: ENTRYPOINT_ADDRESS_V07_TYPE;
  infuraApiKey: string;
  paymasterRpc: string;
  bundlerRpc: string;
}
