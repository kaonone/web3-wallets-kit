import { ConnectWalletConnector } from '../index';

describe('ConnectWalletConnector', (): void => {
  it('should create connector with required config', (): void => {
    const connector = new ConnectWalletConnector({
      projectId: 'test-project-id',
      chains: [1],
      showQrModal: true,
    });
    expect(connector).toBeDefined();
  });

  it('should create connector with full config', (): void => {
    const connector = new ConnectWalletConnector({
      projectId: 'test-project-id',
      chains: [1],
      showQrModal: true,
      optionalChains: [42, 5],
      metadata: {
        name: 'Test App',
        description: 'Test Description',
        url: 'https://test.com',
        icons: ['https://test.com/icon.png'],
      },
    });
    expect(connector).toBeDefined();
  });
});
