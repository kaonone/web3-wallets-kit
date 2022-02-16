/* eslint-disable import/no-duplicates */
import type UAuthClass from '@uauth/js';
import { ClientOptions, LoginOptions, PopupConfig, UserInfo, WalletType } from '@uauth/js';
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import {
  ChainIdCallback,
  ConnectCallback,
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';

export interface UnstoppableConnectionPayload extends DefaultConnectionPayload {
  uauth: UAuthClass;
  subConnector: AbstractConnector<DefaultConnectionPayload> | null;
  user: UserInfo | null;
}

export type UnstoppableConnectors = Record<WalletType, AbstractConnector<DefaultConnectionPayload>>;

export interface UnstoppableConnectorConfig {
  clientOptions: ClientOptions;
  connectors: UnstoppableConnectors;
  popupConfig?: PopupConfig;
  loginOptions?: Partial<Omit<LoginOptions, 'responseMode'>>;
}

export class UnstoppableConnector extends AbstractConnector<UnstoppableConnectionPayload> {
  constructor(private config: UnstoppableConnectorConfig) {
    super();
  }

  public async connect(): Promise<UnstoppableConnectionPayload> {
    const { clientOptions, loginOptions, popupConfig } = this.config;

    const UAuth = (await import('@uauth/js')).default;
    const uauth = new UAuth(clientOptions);

    await uauth.loginWithPopup(loginOptions, popupConfig);
    const { provider, subConnector, user } = await this.activateSubConnector(uauth);

    this.payload = { uauth, provider, subConnector, user };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload?.subConnector) {
      const { uauth, subConnector } = this.payload;

      if (!uauth.fallbackLogoutOptions.rpInitiatedLogout) {
        await uauth.logout({ rpInitiatedLogout: false });
      }
      await subConnector.disconnect();
    }

    super.disconnect();
  }

  public async getAccount() {
    return this.payload?.subConnector?.getAccount() || null;
  }

  public async getChainId() {
    return this.payload?.subConnector?.getChainId() || null;
  }

  public subscribeConnectAccount(callback: ConnectCallback): SubscribedObject {
    const subscriptions = (Object.keys(this.config.connectors) as WalletType[]).map((walletType) =>
      this.config.connectors[walletType].subscribeConnectAccount((account) => {
        if (walletType === this.payload?.user?.wallet_type_hint) {
          callback(account);
        }
      }),
    );

    return { unsubscribe: () => subscriptions.forEach((s) => s.unsubscribe()) };
  }

  public subscribeChainId(callback: ChainIdCallback): SubscribedObject {
    const subscriptions = (Object.keys(this.config.connectors) as WalletType[]).map((walletType) =>
      this.config.connectors[walletType].subscribeChainId((chainId) => {
        if (walletType === this.payload?.user?.wallet_type_hint) {
          callback(chainId);
        }
      }),
    );

    return { unsubscribe: () => subscriptions.forEach((s) => s.unsubscribe()) };
  }

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    const subscriptions = (Object.keys(this.config.connectors) as WalletType[]).map((walletType) =>
      this.config.connectors[walletType].subscribeDisconnect((error) => {
        if (walletType === this.payload?.user?.wallet_type_hint) {
          callback(error);
        }
      }),
    );

    return { unsubscribe: () => subscriptions.forEach((s) => s.unsubscribe()) };
  }

  private async activateSubConnector(uauth: UAuthClass) {
    const user = await uauth.user();

    if (!user.wallet_type_hint) {
      throw new Error('No wallet type present');
    }

    let subConnector = null;

    if (['web3', 'injected'].includes(user.wallet_type_hint)) {
      subConnector = this.config.connectors.web3;
    } else if (user.wallet_type_hint === 'walletconnect') {
      subConnector = this.config.connectors.walletconnect;
    } else {
      throw new Error(`${user.wallet_type_hint} connector not supported`);
    }

    const { provider } = await subConnector?.connect();

    return { provider, subConnector, user };
  }
}
