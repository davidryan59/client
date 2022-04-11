// These are loaded as URL paths by a webpack loader
import { NETWORK } from '@darkforest_eth/contracts';
import diamondContractAbiUrl from '@darkforest_eth/contracts/abis/DarkForest.json';
import { createContract, createEthConnection, EthConnection } from '@darkforest_eth/network';
import type { Contract, providers, Wallet } from 'ethers';

/**
 * Loads the game contract, which is responsible for updating the state of the game.
 */
export async function loadDiamondContract<T extends Contract>(
  address: string,
  provider: providers.JsonRpcProvider,
  signer?: Wallet
): Promise<T> {
  const abi = await fetch(diamondContractAbiUrl).then((r) => r.json());

  return createContract<T>(address, abi, provider, signer);
}

export function getEthConnection(): Promise<EthConnection> {
  const isProdNetwork = (NETWORK.toString() !== 'localhost' && NETWORK.toString() !== 'hardhat');
  const defaultUrl = process.env.DEFAULT_RPC as string;

  let url: string;
  if (isProdNetwork) {
    url = localStorage.getItem('XDAI_RPC_ENDPOINT_v5') || defaultUrl;
  } else {
    url = 'http://localhost:8545';
  }

  console.log(`GAME METADATA:`);
  console.log(`rpc url: ${url}`);
  console.log(`is production network: ${isProdNetwork}`);
  console.log(`webserver url: ${process.env.DF_WEBSERVER_URL}`);

  return createEthConnection(url);
}
