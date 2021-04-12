import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload, Provider } from '@web3-wallets-kit/types';
import type TorusClass from '@toruslabs/torus-embed';

export interface TorusConnectorConfig {
  ctorOptions?: any;
  initOptions?: any;
  loginOptions?: any;
}

export interface TorusConnectionPayload extends DefaultConnectionPayload {
  torus: TorusClass;
}

export class TorusConnector extends AbstractConnector<TorusConnectionPayload> {
  constructor(private config: TorusConnectorConfig) {
    super();
  }

  public async connect(): Promise<TorusConnectionPayload> {
    const { ctorOptions = {}, initOptions = {}, loginOptions = {} } = this.config;
    const TorusLibrary = await import('@toruslabs/torus-embed');

    const Torus = TorusLibrary.default;
    const torus = new Torus(ctorOptions);

    await torus.init(initOptions);
    await torus.login(loginOptions);

    const provider = torus.provider as Provider;

    this.payload = {
      provider,
      torus,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      this.payload.torus.logout();
      this.payload.torus.cleanUp();
    }
    super.disconnect();
  }
}
