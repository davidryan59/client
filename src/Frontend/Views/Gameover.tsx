import { EthAddress, TooltipName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import { TooltipTrigger } from '../Panes/Tooltip';
import { useGameover } from '../Utils/AppHooks';
import { Gold } from '../Components/Text';
import { useUIManager } from '../Utils/AppHooks';
import { AccountLabel } from '../Components/Labels/Labels';

export function Gameover() {
  const uiManager = useUIManager();
  const winners = uiManager.getWinners();
  console.log(`winners: ${winners}`)
  const gameover = useGameover();
  if (!gameover) {
    return <></>;
  }

  return (
    <GameoverContainer>
      <TooltipTrigger
        extraContent={
          <>
            GAMEOVER! The winner{winners.length > 1 ? 's are' : ' is'} {winners[0]}
          </>
        }
        name={TooltipName.Empty}
      >
                    <Gold>GAMEOVER!</Gold> The winner{winners.length > 1 ? 's are' : ' is'} {winners.map((winner => <AccountLabel includeAddressIfHasTwitter = {true} ethAddress = {winner as EthAddress}/>))}

      </TooltipTrigger>
    </GameoverContainer>
  );
}

const GameoverContainer = styled.div`
  font-size: 2em;
  text-align: center;
`;
