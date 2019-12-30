import { Connector, Provider, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import { BitskiSDKOptions, Bitski as BitskiClassType } from 'bitski'; // use only for type definitions!

export interface BitskiConnectionPayload extends DefaultConnectionPayload {
  bitski: BitskiClassType;
}

export interface BitskiConnectorConfig {
  clientId: string;
  redirectUri: string;
  additionalScopes?: string[];
  options?: BitskiSDKOptions;
}

export class BitskiConnector implements Connector<BitskiConnectionPayload> {
  private payload: BitskiConnectionPayload | null = null;

  constructor(private config: BitskiConnectorConfig) {}

  public async connect(): Promise<BitskiConnectionPayload> {
    const { clientId, redirectUri, additionalScopes, options } = this.config;

    const { Bitski } = await import('bitski');

    const bitski = new Bitski(clientId, redirectUri, additionalScopes, options);
    const provider = (bitski.getProvider() as unknown) as Provider;

    await bitski.signIn();

    this.payload = {
      provider,
      bitski,
    };

    return this.payload;
  }

  public async disconnect() {
    this.payload && (await this.payload.bitski.signOut());
  }

  public async getAccount() {
    return (this.payload && (await this.payload.bitski.getUser()).accounts?.[0]) || null;
  }

  public getConnectionPayload() {
    return this.payload;
  }
}
