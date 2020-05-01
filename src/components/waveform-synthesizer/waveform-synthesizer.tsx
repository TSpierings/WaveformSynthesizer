import './waveform-synthesizer.scss';
import * as React from 'react';
import { WaveformEditor } from 'components/waveform-editor/waveform-editor';
import { initSineWaveform } from 'util/waveform';
import { MidiKeyboard } from 'components/midi-keyboard/midi-keyboard';
import { calculateFrequency } from 'util/calculate-frequency';

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
    this.audioBufferSourceNode = this.audioContext.createBufferSource();
  }

  /**
   * Initialize a master gain (volume) node.
   */
  initMasterGainNode(): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(this.audioContext.destination);
    return gainNode;
  }

  /**
   * Initialize an AudioBufferSourceNode which will be filled with the waveform and played at the desired frequency.
   * It will be connected to the masterGainNode, so that should exist before this function is called.
   */
  initAudiobufferSource(targetFrequency: number): AudioBufferSourceNode {
    const audioBufferSourceNode = this.audioContext.createBufferSource();
    audioBufferSourceNode.connect(this.masterGainNode);
    audioBufferSourceNode.loop = true;

    const waveformFrequency = this.audioContext.sampleRate / WaveformSynthesizer.waveBufferLength;
    audioBufferSourceNode.playbackRate.value = targetFrequency / waveformFrequency;

    audioBufferSourceNode.buffer = this.createWaveformBuffer();

    return audioBufferSourceNode;
  }

  /**
   * Create an AudioBuffer from the waveform in state.
   */
  createWaveformBuffer(): AudioBuffer {
    const buffer = this.audioContext.createBuffer(1, WaveformSynthesizer.waveBufferLength, this.audioContext.sampleRate);
    const bufferData = buffer.getChannelData(0);

    for (let i = 0; i < WaveformSynthesizer.waveBufferLength; i++) {
      bufferData[i] = this.state.waveform[i];
    }

    return buffer;
  }

  onWaveFormBufferChange = (waveform: Array<number>) => {
    this.setState({
      waveform: waveform
    });
  }

  toggleNote(note: number, state: boolean) {
    if (state) {
      this.audioBufferSourceNode = this.initAudiobufferSource(calculateFrequency(note));
      this.audioBufferSourceNode.start();
    } else {
      this.audioBufferSourceNode.stop();
    }
  }

  parseMidiMessage = (message: any) => {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = message.data.length > 2 ? message[2] : 0;

    switch(command) {
      case 144:
        this.toggleNote(note, true);
        break;
      case 128:
        this.toggleNote(note, false);
        break;
    }
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
      <div className='midi-keyboard'>
        <MidiKeyboard 
          onMidiMessage={this.parseMidiMessage}/>
      </div>
    </div>;
  }
}
