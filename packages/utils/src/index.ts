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
  const { result: account, sendingInterface: nextInterface } = await send<string | null>(
    provider,
    'eth_accounts',
    (accounts: string[]) => accounts[0] || null,
    sendingInterface,
  );
  return { account, sendingInterface: nextInterface };
}

export async function getChainId(
  provider: Provider,
  sendingInterface?: SendingInterface,
): Promise<{ chainId: number; sendingInterface: SendingInterface }> {
  const { result: chainId, sendingInterface: nextInterface } = await send<number>(
    provider,
    'eth_chainId',
    (id: string | number) => {
      if (!id) {
        throw new Error('ChainId is not found');
      }

      return Number(id);
    },
    sendingInterface,
  );
  return { chainId, sendingInterface: nextInterface };
}

async function send<T>(
  provider: Provider,
  method: string,
  convert: (value: any) => T,
  sendingInterface?: SendingInterface,
): Promise<{ result: T; sendingInterface: SendingInterface }> {
  if (sendingInterface !== 'Old Web3.js') {
    try {
      const sendResult = await provider.send(method);
      const result = convert(isJsonRPCResponse(sendResult) ? sendResult.result : sendResult);
      return { result, sendingInterface: 'EIP 1193' };
    } catch {
      warning('EIP 1193 sending failed, trying to old Web3.js sending interface');
    }
  }

  const result: T = await new Promise((resolve, reject) => {
    (provider.sendAsync || provider.send).call(
      provider,
      { method },
      (err: any, sendResult: any) => {
        err && reject(err);
        resolve(convert(sendResult?.result));
      },
    );
  });

  return { result, sendingInterface: 'Old Web3.js' };
}

const isJsonRPCResponse = (response: any): response is { result: any } => {
  return typeof response === 'object' && 'jsonrpc' in response && 'result' in response;
};
