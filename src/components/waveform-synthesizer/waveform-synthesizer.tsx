import './waveform-synthesizer.scss';
import * as React from 'react';
import { WaveformEditor } from 'components/waveform-editor/waveform-editor';
import { initSineWaveform } from 'util/waveform';
import { MidiKeyboard } from 'components/midi-keyboard/midi-keyboard';
import { calculateFrequency } from 'util/calculate-frequency';
import { isNullOrUndefined } from 'util';
import { Voice } from 'audio/voice';
import { MasterMixBar } from 'components/master-mix-bar/master-mix-bar';

interface WaveformSynthesizerState {
  waveform: Array<number>;
}

export class WaveformSynthesizer extends React.Component<{}, WaveformSynthesizerState> {
  static waveBufferLength = 100;

  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private audioBufferSourceNode: AudioBufferSourceNode;

  private activeNotes: Map<number, Array<Voice>>;

  constructor(props: any) {
    super(props);

    this.state = {
      waveform: initSineWaveform(WaveformSynthesizer.waveBufferLength)
    }

    this.activeNotes = new Map();
    this.audioContext = new AudioContext();
    this.masterGainNode = this.initMasterGainNode();
    this.audioBufferSourceNode = this.audioContext.createBufferSource();
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
   * When the waveform changes, save it to the state.
   */
  onWaveFormBufferChange = (waveform: Array<number>) => {
    this.setState({
      waveform: waveform
    });
  }

  /**
   * Toggle the given note on/off.
   */
  toggleNote(note: number, on: boolean) {
    if (on) {
      this.activateNote(note);
    } else {
      this.disableNote(note);
    }
  }

  /**
   * Activate a given note, creating and starting all voices for that note.
   */
  activateNote(note: number) {
    const voices = this.activeNotes.get(note);

    if (!isNullOrUndefined(voices)) {
      voices.forEach(voice => voice.stop());
    }

    const harmonicVoices = new Array<Voice>();
    const frequency = calculateFrequency(note);
    for(let i = 1; i <= 12; i++) {
      const voice = new Voice(frequency * i, 1 / i, this.state.waveform, this.masterGainNode, this.audioContext);
      harmonicVoices.push(voice);
    }

    this.activeNotes.set(note, harmonicVoices);
  }

  /**
   * Stop a playing note.
   */
  disableNote(note: number) {
    const voices = this.activeNotes.get(note);

    if (!isNullOrUndefined(voices)) {
      voices.forEach(voice => voice.stop());
    }
  }

  /**
   * Parse a midi message.
   * Currently only supports toggling a note on/off.
   */
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

  setMasterGain = (value: number) => {
    this.masterGainNode.gain.value = value / 100;
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
      <div className='midi-keyboard'>
        <MidiKeyboard 
          onMidiMessage={this.parseMidiMessage}/>
      </div>
      <div className='master'>
        <MasterMixBar onMasterGainChange={this.setMasterGain}/>
      </div>
      <div className='waveform-editor'>
        <WaveformEditor waveformBuffer={this.state.waveform} 
          onWaveformBufferChange={this.onWaveFormBufferChange}/>
        </div>
      <div className='frequency-graph'><label>Frequency graph placeholder</label></div>
      
    </div>;
  }
}
