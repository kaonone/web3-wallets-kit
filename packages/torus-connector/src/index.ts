import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload, Provider } from '@web3-wallets-kit/types';

type InferFirstArg<T extends (...args: any[]) => void> = T extends (
  first: infer F,
  ...args: any[]
) => void
  ? F
  : never;

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type TorusCtor = typeof import('@toruslabs/torus-embed').default;
type TorusClass = import('@toruslabs/torus-embed').default;
type TorusCtorOptions = ConstructorParameters<TorusCtor>[0];
type TorusInitOptions = InferFirstArg<TorusClass['init']>;
type TorusLoginOptions = InferFirstArg<TorusClass['login']>;

export interface TorusConnectorConfig {
  ctorOptions?: TorusCtorOptions;
  initOptions?: TorusInitOptions;
  loginOptions?: TorusLoginOptions;
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
