import './waveform-synthesizer.scss';
import * as React from 'react';
import { WaveformEditor } from 'components/waveform-editor/waveform-editor';
import { initSineWaveform } from 'util/waveform';

interface WaveformSynthesizerState {
  waveform: Array<number>
}

export class WaveformSynthesizer extends React.Component<{}, WaveformSynthesizerState> {
  static waveBufferLength = 100;

  constructor(props: any) {
    super(props);

    this.state = {
      waveform: initSineWaveform(WaveformSynthesizer.waveBufferLength)
    }
  }

  onWaveFormBufferChange = (buffer: Array<number>) => {
    this.setState({
      waveform: buffer
    })
  }

  render() {
    return <div className='waveform-synthesizer'>
      <div className='master'><label>Master mix bar placeholder</label></div>
      <div className='waveform-editor'>
        <WaveformEditor waveformBuffer={this.state.waveform} 
          onWaveformBufferChange={this.onWaveFormBufferChange}/>
        </div>
      <div className='frequency-graph'><label>Frequency graph placeholder</label></div>
      <div className='midi-keyboard'><label>Midi keyboard placeholder</label></div>
    </div>;
  }
}
