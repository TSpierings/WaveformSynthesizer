import './midi-keyboard.scss';
import * as React from 'react';
import { MidiKeyboardKey } from 'components/midi-keyboard-key/midi-keyboard-key';

interface MidiKeyboardProps {
  onMidiMessage: Function
}

interface MidiKeyboardState {
  activeKeys: Array<number>;
}

const midiNoteOn = 144;
const midiNoteOff = 128;

export class MidiKeyboard extends React.Component<MidiKeyboardProps, MidiKeyboardState> {
  private keyboardRef: React.RefObject<HTMLDivElement>;
  private keyboardKeys: Array<number>;
  private firstKey = 21;

  constructor(props: MidiKeyboardProps) {
    super(props)

    this.keyboardRef = React.createRef();

    // It displays 87 keys on the on-screen keyboard by default.
    // TODO: make dynamic for  small devices.
    this.keyboardKeys = new Array(87);
    for(let i = 0; i < 87; i++) {
      this.keyboardKeys[i] = i;
    }

    this.state = {
      activeKeys: []
    }
  }

  /**
   * Publish all MIDI device messages.
   */
  onMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    this.props.onMidiMessage(message);
    this.setActiveNotes(message.data[1], message.data[0] === midiNoteOn ? true : false);
  }

  /**
   * Add or remove a note from the set of activeNotes.
   * @param note note to add/remove.
   * @param on True for adding, false for removing.
   */
  setActiveNotes(note: number, on: boolean) {
    this.setState(state => {
      let newState = state

      if (on) {
        newState.activeKeys.push(note)
      } else {
        newState.activeKeys.splice(state.activeKeys.findIndex(k => k === note), 1);
      }

      return newState;
    })
  }

  /**
   * Toggle a given note to a given state.
   * Will use maximum velocity for the keypress.
   */
  toggleNote = (key: number, state: boolean) => {
    this.setActiveNotes(key + this.firstKey, state);
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
    return <div className="keyboard"
      ref={this.keyboardRef}>
      {this.keyboardKeys.map((key) => 
        <MidiKeyboardKey key={key} 
          note={key + this.firstKey}
          isActive={this.state.activeKeys.some(k => k === key + this.firstKey)}
          onToggleNote={(state: boolean) => this.toggleNote(key, state)}/>
      )}
    </div>
  }
}
