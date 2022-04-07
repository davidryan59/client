import _ from 'lodash';
import React from 'react';
import {
  Checkbox,
  DarkForestCheckbox,
  DarkForestNumberInput,
  NumberInput,
} from '../../Components/Input';
import { ModifierType } from '@darkforest_eth/types';
import { Row } from '../../Components/Row';
import { DarkForestSlider, Slider } from '../../Components/Slider';
import { Sub } from '../../Components/Text';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';
import { ModifierText } from '../../Components/Labels/ModifierLabels';

const rowChunkSize = 3;
const rowStyle = { gap: '8px' } as CSSStyleDeclaration & React.CSSProperties;
const itemStyle = { flex: `1 1 ${Math.floor(100 / rowChunkSize)}%` };

function WorldConstants({
  index,
  value,
  name,
  onUpdate,
}: LobbiesPaneProps & { name : string; value: number | undefined; index: number }) {
  // The level 0 value can never change
    return (
      <div style={itemStyle}>
        <ModifierText modifier = {index as ModifierType}/>
        <NumberInput
          format='integer'
          value={value}
          onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
            onUpdate({ type: 'MULTIPLIERS', index, value: e.target.value });
          }}
        />
      </div>
    );
}

export function GameSettingsPane({ config, onUpdate }: LobbiesPaneProps) {

  let worldConstants =  _.chunk(config.MULTIPLIERS.displayValue, rowChunkSize).map(
    (items, rowIdx) => {
      return (
        <Row key={`threshold-row-${rowIdx}`} style={rowStyle}>
          {items.map((item, idx) => (
            <WorldConstants
              key={`threshold-lvl-${idx}`}
              config={config}
              name = {item?.toString() || "none"}
              value={item}
              index={rowIdx * rowChunkSize + idx}
              onUpdate={onUpdate}
            />
          ))}
        </Row>
      );
    }
  );

  return (
    <>
      <Row>
        <Slider
          variant='filled'
          label='Game speed'
          formatOptions={{ style: 'unit', unit: 'x' }}
          min={1}
          max={60}
          step={1}
          value={config.TIME_FACTOR_HUNDREDTHS.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestSlider>) => {
            onUpdate({ type: 'TIME_FACTOR_HUNDREDTHS', value: e.target.value });
          }}
        />
      </Row>
      <Row>
        <span>Advanced: Modify game constants</span>
      </Row>
      {worldConstants}
      <Row>
        <Warning>{config.MULTIPLIERS.warning}</Warning>
      </Row>
      <Row>
        <Warning>{config.TIME_FACTOR_HUNDREDTHS.warning}</Warning>
      </Row>
      <Row>
        <Checkbox
          label='Planet transfer enabled?'
          checked={config.PLANET_TRANSFER_ENABLED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
            onUpdate({ type: 'PLANET_TRANSFER_ENABLED', value: e.target.checked });
          }}
        />
      </Row>
      <Row>
        <Warning>{config.PLANET_TRANSFER_ENABLED.warning}</Warning>
      </Row>
      <Row>
        <span>Location reveal cooldown (in seconds)</span>
        <NumberInput
          value={config.LOCATION_REVEAL_COOLDOWN.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
            onUpdate({ type: 'LOCATION_REVEAL_COOLDOWN', value: e.target.value });
          }}
        />
      </Row>
      <Row>
        <Warning>{config.LOCATION_REVEAL_COOLDOWN.warning}</Warning>
      </Row>
      <Row>
        {/* It is a little weird that this is in Game Settings, but I'd rather keep other scoring grouped */}
        <span>Points per silver withdrawn</span>
        <NumberInput
          format='float'
          value={config.SILVER_SCORE_VALUE.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
            onUpdate({ type: 'SILVER_SCORE_VALUE', value: e.target.value });
          }}
        />
      </Row>
      <Row>
        <Warning>{config.SILVER_SCORE_VALUE.warning}</Warning>
      </Row>
      <Row>
        <Checkbox
          label='Move cap enabled?'
          checked={config.MOVE_CAP_ENABLED.displayValue}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) =>
            onUpdate({ type: 'MOVE_CAP_ENABLED', value: e.target.checked })
          }
        />
      </Row>
      <Row>
        <Warning>{config.MOVE_CAP_ENABLED.warning}</Warning>
      </Row>
      {config.MOVE_CAP_ENABLED.displayValue && (
        <>
          <Row>
            <span>Set move cap</span>
            <NumberInput
              value={config.MOVE_CAP.displayValue}
              onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
                onUpdate({ type: 'MOVE_CAP', value: e.target.value });
              }}
            />
          </Row>
          <Row>
            <Warning>{config.MOVE_CAP.warning}</Warning>
          </Row>
        </>
      )}
    </>
  );
}
