// organize-imports-ignore
import { DarkForest } from '@darkforest_eth/contracts/typechain';
import type {
  ContractMethodName,
  EthAddress,
  LocatablePlanet,
  LocationId,
  Planet,
  Transaction,
  TxIntent,
} from '@darkforest_eth/types';
import { ContractTransaction } from 'ethers';
import {
  MAX_ARTIFACT_RARITY,
  MAX_SPACESHIP_TYPE,
  MIN_ARTIFACT_RARITY,
  MIN_ARTIFACT_TYPE,
  MIN_SPACESHIP_TYPE,
  //@ts-ignore
} from 'https://cdn.skypack.dev/@darkforest_eth/constants';
//@ts-ignore
import { getPlanetNameHash } from 'https://cdn.skypack.dev/@darkforest_eth/procedural';
import {
  locationIdToDecStr,
  artifactIdFromHexStr,
  //@ts-ignore
} from 'https://cdn.skypack.dev/@darkforest_eth/serde';
import {
  ArtifactRarityNames,
  ArtifactType,
  ArtifactTypeNames,
  //@ts-ignore
} from 'https://cdn.skypack.dev/@darkforest_eth/types';
import {
  html,
  render,
  useEffect,
  useState,
  //@ts-ignore
} from 'https://unpkg.com/htm/preact/standalone.module.js';

type Tx = Transaction<{
  args: Promise<never[]>;
  contract: DarkForest;
  methodName: ContractMethodName;
}>

async function dfWaitWithMetrics(tx: Tx): Promise<void> {
  try {
    console.log(`tx`, tx);
    const submit = await tx.submittedPromise;
    console.log(`submit`, submit);
    var startTime = performance.now()
    const receipt = await tx.confirmedPromise;
    var endTime = performance.now()
    console.log(`${tx.intent.methodName} confirmed ${endTime - startTime} milliseconds`)
    console.log(`confirmed with ${receipt.confirmations} blocks, ${receipt.gasUsed} gas used and ${submit.gasPrice} price (wei)`);  
  } catch (error) {
    console.error(`ERROR`, error);
  }
}

async function waitWithMetrics(tx: ContractTransaction, name?: string): Promise<void> {
  try {
    var startTime = performance.now()
    const receipt = await tx.wait();
    var endTime = performance.now()
    console.log(`${name} confirmed ${endTime - startTime} milliseconds`)
    console.log(`confirmed with ${receipt.confirmations} blocks, ${receipt.gasUsed} gas used and ${tx.gasPrice} price (wei)`);  
  } catch (error) {
    console.error(`ERROR`)
  }
}

async function submitRawTx(txIntent: TxIntent): Promise<void> {
  console.log(`contract`, txIntent.contract);
};

async function pauseGame() {
  const tx = await df.submitTransaction({
    args: Promise.resolve([]),
    contract: df.getContract(),
    methodName: 'pause' as ContractMethodName,
  });
  await dfWaitWithMetrics(tx);
  return tx;
}

async function unpauseGame() {
  const tx = await df.submitTransaction({
    args: Promise.resolve([]),
    contract: df.getContract(),
    methodName: 'unpause' as ContractMethodName,
  });
  await dfWaitWithMetrics(tx);
  return tx;
}

async function rawPauseGame() {
  const contract = df.getContract();
  const tx = await contract.pause()
  await waitWithMetrics(tx, 'raw pause');
}

async function rawUnpauseGame() {
  const contract = df.getContract();
  const tx = await contract.unpause()
  await waitWithMetrics(tx, 'raw unpause');
}

function Heading({ title }: { title: string }) {
  return html`<h2 style=${{ fontSize: '14pt', textDecoration: 'underline' }}>${title}</h2>`;
}


const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const rowStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedShip, setSelectedShip] = useState(MIN_SPACESHIP_TYPE);
  const [selectedArtifact, setSelectedArtifact] = useState(MIN_ARTIFACT_TYPE);
  const [artifactRarity, setArtifactRarity] = useState('1');
  const [whitelistAddress, setWhitelistAddress] = useState(null);
  const [account, setAccount] = useState(null);
  const [shipAccount, setShipAccount] = useState(null);
  const [planetAccount, setPlanetAccount] = useState(null);
  const [artifactAccount, setArtifactAccount] = useState(null);

  useEffect(() => {
    const account = df.getAccount();
    setAccount(account);
    setShipAccount(account);
    setPlanetAccount(account);
    setArtifactAccount(account);
  }, []);

  useEffect(() => {
    const subscription = ui.selectedPlanetId$.subscribe((p: LocationId) => {
      setSelectedPlanet(ui.getPlanetWithId(p));
    });

    return () => subscription.unsubscribe();
  }, [setSelectedPlanet]);

  return html`
    <div style=${wrapperStyle}>
      <p>Logged in as account: ${account}</p>

      <${Heading} title="Game state" />

      <div style=${rowStyle}>
        <span>Change game state:</span>
        <df-button onClick=${() => pauseGame()}> Pause </df-button>
        <df-button onClick=${() => unpauseGame()}> Unpause </df-button>
        <df-button onClick=${() => rawPauseGame()}> Raw Pause </df-button>
        <df-button onClick=${() => rawUnpauseGame()}> Raw Unpause </df-button>
      </div>
    </div>
  `;
}

class Plugin implements DFPlugin {
  async render(container: HTMLDivElement) {
    container.style.width = '525px';

    render(html`<${App} />`, container);
  }
}

export default Plugin;
