import { Provider } from '@web3-wallets-kit/types';

const isProduction: boolean = process.env.NODE_ENV === 'production';

export function warning(message: string) {
  if (!isProduction) {
    console.warn(message);
  }
}

export function invariant(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant failed${isProduction || !message ? '.' : `: ${message}`}`);
  }
}

export type SendingInterface = 'EIP 1193' | 'Old Web3.js';

export async function getAccount(
  provider: Provider,
  sendingInterface?: SendingInterface,
): Promise<{ account: string | null; sendingInterface: SendingInterface }> {
  if (sendingInterface !== 'Old Web3.js') {
    try {
      const accounts: string[] = await provider.send('eth_accounts');
      const account = accounts[0] || null;
      return { account, sendingInterface: 'EIP 1193' };
      // return accounts[0] || null; // TODO uncomment after TSDX updating https://github.com/jaredpalmer/tsdx/issues/423
    } catch {
      warning('EIP 1193 sending failed, trying to old Web3.js sending interface');
    }
  }

  const account: string | null = await new Promise((resolve, reject) => {
    (provider.sendAsync || provider.send)({ method: 'eth_accounts' }, (err, sendResult) => {
      err && reject(err);
      resolve(sendResult?.result?.[0] || null);
    });
  });

  return { account, sendingInterface: 'Old Web3.js' };
}
