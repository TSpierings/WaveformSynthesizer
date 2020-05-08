import './master-mix-bar.scss'
import * as React from 'react';
import { Knob } from 'components/shared/knob/knob';

export interface MasterMixBarProps {
  onMasterGainChange: Function
}

export class MasterMixBar extends React.Component<MasterMixBarProps, {}> {

  render() {
    return <div className='master-mix-bar'>
      <h1>Waveform Synthesizer</h1>
      <Knob min={0} max={100} default={20} name='master' onValueChange={this.props.onMasterGainChange}/>
    </div>
  }
}
