import { TooltipName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import { TooltipTrigger } from '../Panes/Tooltip';
import { useGameover } from '../Utils/AppHooks';
import { Gold } from '../Components/Text';


export function Gameover({ winners }: { winners: string[]}) {
  const gameover = useGameover();
  if (!gameover) {
    return <></>;
  }

  return (
    <GameoverContainer>
      <TooltipTrigger
        extraContent={
          <>
            GAMEOVER! The winner{winners.length > 1 ? 's are' : ' is'} {winners.forEach((winner => `${ winner}`))}
          </>
        }
        name={TooltipName.Empty}
      >
                    <Gold>GAMEOVER!</Gold> The winner{winners.length > 1 ? 's are' : ' is'} {winners.forEach((winner => `${ winner}`))}

      </TooltipTrigger>
    </GameoverContainer>
  );
}

const GameoverContainer = styled.div`
  font-size: 2em;
  text-align: center;
`;
