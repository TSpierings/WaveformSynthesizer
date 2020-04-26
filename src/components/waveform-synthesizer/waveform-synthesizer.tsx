import './waveform-synthesizer.scss';
import * as React from 'react';

export class WaveformSynthesizer extends React.Component<{}, {}> {
  render() {
    return <div className='waveform-synthesizer'>
      <div className='master'><label>Master mix bar placeholder</label></div>
      <div className='waveform-editor'><label>Waveform editor placeholder</label></div>
      <div className='frequency-graph'><label>Frequency graph placeholder</label></div>
      <div className='midi-keyboard'><label>Midi keyboard placeholder</label></div>
    </div>;
  }
}
