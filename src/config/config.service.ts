import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app-config';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';

@Injectable()
export class BleapConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig(): AppConfig {
    return {
      port: this.configService.getOrThrow<number>('PORT'),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      infuraApiKey: this.configService.getOrThrow<string>('INFURA_API_KEY'),
      paymasterRpc: this.configService.getOrThrow<string>('PAYMASTER_RPC'),
      bundlerRpc: this.configService.getOrThrow<string>('BUNDLER_RPC'),
    };
  }
}
