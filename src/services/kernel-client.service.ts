import { Injectable } from '@nestjs/common';
import { type Chain, Client, createPublicClient, Hex, http } from 'viem';

import { ModularSigner, toPermissionValidator } from '@zerodev/permissions';
import { createKernelAccount, createKernelAccountClient } from '@zerodev/sdk';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { PimlicoSponsorUserOperationParameters } from 'permissionless/actions/pimlico/sponsorUserOperation';
import { ENTRYPOINT_ADDRESS_V07_TYPE } from 'permissionless/types';
import { privateKeyToAccount } from 'viem/accounts';
import {
  toCosigningSigner,
  toEmptyCosigningSigner,
} from '@zerodev/permissions/signers';
import type { Address } from 'abitype';
import { COSIGNER_MODULE_ADDRESSES, getRpcUrl } from '../tools/chain-id-mapper';
import { AppConfig } from '../config/app-config';
import { BLEAP_COSIGNER_PRIVATE_KEY } from '../tools/to-delete';

@Injectable()
export class KernelClientService {
  constructor(private readonly appConfig: AppConfig) {}

  public async getEmptyUserKernelClient(
    isUserOpSponsored: boolean,
    chain: Chain,
    rootSignerAddress: Address,
  ) {
    const emptyUserSigner = (await this.getEmptyUserSigner(
      chain,
      rootSignerAddress,
    )) as any;
    return this.createKernelClient(isUserOpSponsored, chain, emptyUserSigner);
  }

  public async getBleapKernelClient(isUserOpSponsored: boolean, chain: Chain) {
    const cosigningSigner = (await this.getBleapSigner(chain)) as any;
    return this.createKernelClient(isUserOpSponsored, chain, cosigningSigner);
  }

  private async createKernelClient(
    isUserOpSponsored: boolean,
    chain: Chain,
    signer: ModularSigner,
  ) {
    const publicClient: Client = this.createPublicClient(chain);
    const account = await this.getAccount(publicClient, signer);
    const sponsoredConfig = await this.getSponsoredConfig(
      isUserOpSponsored,
      chain,
    );

    return createKernelAccountClient({
      account,
      entryPoint: this.appConfig.entryPoint,
      chain: chain as any,
      bundlerTransport: http(this.appConfig.bundlerRpc) as any,
      middleware: {
        gasPrice: async (): Promise<{
          maxFeePerGas: bigint;
          maxPriorityFeePerGas: bigint;
        }> => {
          return {
            maxFeePerGas: BigInt(0),
            maxPriorityFeePerGas: BigInt(0),
          };
        },
        sponsorUserOperation: sponsoredConfig,
      },
    });
  }

  /*
   * Generate the Public Client
   * */
  private createPublicClient(chain: Chain): Client {
    return createPublicClient({
      transport: http(getRpcUrl(chain.id, this.appConfig.infuraApiKey)),
    }) as any;
  }

  /*
   * Generate the Bleap Signer
   * */
  private async getEmptyUserSigner(chain: Chain, rootSignerAddress: Address) {
    return toEmptyCosigningSigner({
      signerAddress: rootSignerAddress,
      signerContractAddress: COSIGNER_MODULE_ADDRESSES[chain.id],
    });
  }

  /*
   * Generate the Bleap Signer
   * */
  private async getBleapSigner(chain: Chain) {
    // TODO: Improve this in order to use Dfns signer where in DEV or PROD
    const bleapCosignerKey = privateKeyToAccount(
      BLEAP_COSIGNER_PRIVATE_KEY as Hex,
    );

    return toCosigningSigner({
      signer: bleapCosignerKey,
      signerContractAddress: COSIGNER_MODULE_ADDRESSES[chain.id],
    });
  }

  private async getAccount(publicClient: any, cosigningSigner: ModularSigner) {
    const permissionValidator = await toPermissionValidator(publicClient, {
      entryPoint: this.appConfig.entryPoint,
      signer: cosigningSigner,
      policies: [],
    });

    return await createKernelAccount(publicClient, {
      plugins: {
        sudo: permissionValidator,
      },
      entryPoint: this.appConfig.entryPoint,
    });
  }

  private async getSponsoredConfig(isUserOpSponsored: boolean, chain: Chain) {
    if (!isUserOpSponsored) {
      return undefined;
    }

    return async ({ userOperation }) => {
      const paymasterClient = createPimlicoPaymasterClient({
        chain: chain,
        transport: http(this.appConfig.paymasterRpc),
        entryPoint: this.appConfig.entryPoint,
      });
      const sponsorUserOperationParams: Omit<
        PimlicoSponsorUserOperationParameters<ENTRYPOINT_ADDRESS_V07_TYPE>,
        'entrypoint'
      > = {
        userOperation,
        entryPoint: this.appConfig.entryPoint,
      };

      return paymasterClient.sponsorUserOperation(sponsorUserOperationParams);
    };
  }
}
