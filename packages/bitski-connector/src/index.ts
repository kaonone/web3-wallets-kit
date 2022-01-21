import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { Provider, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import type { BitskiSDKOptions, Bitski as BitskiClassType, ProviderOptions } from 'bitski';

export interface BitskiConnectionPayload extends DefaultConnectionPayload {
  bitski: BitskiClassType;
}

export interface BitskiConnectorConfig {
  clientId: string;
  redirectUri: string;
  additionalScopes?: string[];
  options?: BitskiSDKOptions;
  providerOptions?: ProviderOptions;
}

export class BitskiConnector extends AbstractConnector<BitskiConnectionPayload> {
  constructor(private config: BitskiConnectorConfig) {
    super();
  }

  public async connect(): Promise<BitskiConnectionPayload> {
    const { clientId, redirectUri, additionalScopes, options, providerOptions } = this.config;

    const { Bitski } = await import('bitski');

    const bitski = new Bitski(clientId, redirectUri, additionalScopes, options);
    const provider = (bitski.getProvider(providerOptions) as unknown) as Provider;

    await bitski.signIn();

    this.payload = {
      provider,
      bitski,
    };

    return this.payload;
  }

  public async disconnect() {
    this.payload && (await this.payload.bitski.signOut());
    super.disconnect();
  }

  public async getAccount() {
    return (this.payload && (await this.payload.bitski.getUser()).accounts?.[0]) || null;
  }
}
