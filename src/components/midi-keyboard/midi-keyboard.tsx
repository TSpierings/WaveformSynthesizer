import './midi-keyboard.scss';
import * as React from 'react';
import { MidiKeyboardKey } from 'components/midi-keyboard-key/midi-keyboard-key';

interface MidiKeyboardProps {
  onMidiMessage: Function
}

const midiNoteOn = 144;
const midiNoteOff = 128;

export class MidiKeyboard extends React.Component<MidiKeyboardProps, {}> {
  private keyboardKeys: Array<number>;
  private firstKey = 21;

  constructor(props: MidiKeyboardProps) {
    super(props)

    // It displays 87 keys on the on-screen keyboard by default.
    // TODO: make dynamic for  small devices.
    this.keyboardKeys = new Array(87);
    for(let i = 0; i < 87; i++) {
      this.keyboardKeys[i] = i;
    }
  }

  /**
   * On a MIDI message from one of the attached devices, just send it to the synthesizer.
   */
  onMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    this.props.onMidiMessage(message);
  }

  /**
   * Toggle a given note to a given state.
   * Will use maximum velocity for the keypress.
   */
  toggleNote = (key: number, state: boolean) => {
    this.props.onMidiMessage({
      data: [
        state ? midiNoteOn : midiNoteOff,
        key + this.firstKey, // 21 is the first note on our keyboard (C0).
        127 // Max velocity.
      ]
    });
  }

  /**
   * On load attach a handler for midi events to every midi device.
   */
  componentWillMount() {
    navigator.requestMIDIAccess().then((midiAccess) => {
      midiAccess.inputs.forEach(device => {
        device.onmidimessage = this.onMidiMessage;
      });
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return <div className="keyboard">
      {this.keyboardKeys.map((key) => 
        <MidiKeyboardKey key={key} note={key + this.firstKey} onToggleNote={(state: boolean) => this.toggleNote(key, state)}/>
      )}
    </div>
  }
}
