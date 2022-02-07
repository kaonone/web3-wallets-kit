/* eslint-disable import/no-duplicates */
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';
import type CloverWebClass from '@clover-network/web-wallet-sdk';
import type { CloverInpageProvider, CloverParams } from '@clover-network/web-wallet-sdk';

type CtorArgs = ConstructorParameters<typeof CloverWebClass>[0];
type LoginParams = Parameters<CloverWebClass['login']>[0];

export interface CloverWebConnectorConfig {
  ctorOptions?: CtorArgs;
  initOptions?: CloverParams;
  loginOptions?: LoginParams;
}

export interface CloverWebConnectionPayload extends DefaultConnectionPayload {
  clover: CloverWebClass;
  provider: CloverInpageProvider;
}

export class CloverWebConnector extends AbstractConnector<CloverWebConnectionPayload> {
  constructor(private config?: CloverWebConnectorConfig) {
    super();
  }

  public async connect(): Promise<CloverWebConnectionPayload> {
    const { ctorOptions = {}, initOptions = {}, loginOptions = {} } = this.config || {};
    const CloverWebLibrary = await import('@clover-network/web-wallet-sdk');

    const CloverWeb = CloverWebLibrary.default;
    const clover = new CloverWeb(ctorOptions);

    this.payload = { clover, provider: clover.provider };

    await clover.init(initOptions);
    await clover.login(loginOptions);

    this.payload = {
      clover,
      provider: clover.provider,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      await this.payload.clover.cleanUp();
    }
    super.disconnect();
  }
}
