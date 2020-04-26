import './waveform-synthesizer.scss';
import * as React from 'react';
import { WaveformEditor } from 'components/waveform-editor/waveform-editor';
import { initSineWaveform } from 'util/waveform';

interface WaveformSynthesizerState {
  waveform: Array<number>;
}

export class WaveformSynthesizer extends React.Component<{}, WaveformSynthesizerState> {
  static waveBufferLength = 100;

  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private audioBufferSourceNode: AudioBufferSourceNode;

  constructor(props: any) {
    super(props);

    this.state = {
      waveform: initSineWaveform(WaveformSynthesizer.waveBufferLength)
    }

    this.audioContext = new AudioContext();
    this.masterGainNode = this.initMasterGainNode();
    this.audioBufferSourceNode = this.initAudiobufferSource();
  }

  /**
   * Initialize a master gain (volume) node.
   */
  initMasterGainNode(): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(this.audioContext.destination);
    return gainNode;
  }

  /**
   * Initialize an AudioBufferSourceNode which will be filled with the waveform at a magic frequency.
   * It will be connected to the masterGainNode, so that should exist before this function is called.
   */
  initAudiobufferSource(): AudioBufferSourceNode {
    const audioBufferSourceNode = this.audioContext.createBufferSource();
    audioBufferSourceNode.connect(this.masterGainNode);
    audioBufferSourceNode.loop = true;

    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate, this.audioContext.sampleRate);
    const bufferData = buffer.getChannelData(0);

    this.fillAudioBuffer(bufferData);

    audioBufferSourceNode.buffer = buffer;

    return audioBufferSourceNode;
  }

  /**
   * Fill an AudioBuffer with the waveform from the state, at a magic frequency. 
   * This function assumes that the audioBuffer is 1 second long, the sample rate does not matter.
   * @param audioBuffer The audiobuffer that should be filled.
   */
  fillAudioBuffer(audioBuffer: Float32Array) {
    const frequency = 440;
    const waveformRatio = this.audioContext.sampleRate / frequency;

    for (let i = 0; i < audioBuffer.length; i++) {
      const waveformPartial = ((i / waveformRatio) * this.state.waveform.length) % this.state.waveform.length;
      const startFrameIndex = Math.floor(waveformPartial);
      const endFrameIndex = (startFrameIndex + 1) % this.state.waveform.length;
      const leftover = waveformPartial % 1;

      const valueA = this.state.waveform[startFrameIndex];
      const valueB = this.state.waveform[endFrameIndex];

      const result = (valueB - valueA) * leftover + valueA;
      audioBuffer[i] = result;
    }
  }

  onWaveFormBufferChange = (waveform: Array<number>) => {
    this.setState({
      waveform: waveform
    });

    this.audioBufferSourceNode.stop();
    this.audioBufferSourceNode.disconnect();
    this.audioBufferSourceNode = this.initAudiobufferSource();
    this.audioBufferSourceNode.start();
  }

  //#region Lifecycle functions
  componentDidMount() {
    this.audioBufferSourceNode.start();
  }

  componentWillUnmount() {
    this.audioBufferSourceNode.stop();
    this.audioBufferSourceNode.disconnect();
    this.masterGainNode.disconnect();
  }
  //#endregion

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
