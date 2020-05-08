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
  private currentOctave = 2;

  constructor(props: MidiKeyboardProps) {
    super(props)

    this.keyboardRef = React.createRef();
    this.keyboardKeys = new Array();

    this.state = {
      activeKeys: []
    }
  }

  setKeys(count: number) {
    this.keyboardKeys = new Array(count);
    for(let i = 0; i < count; i++) {
      this.keyboardKeys[i] = i;
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
    this.setActiveNotes(key + this.currentOctave * 12, state);
    this.props.onMidiMessage({
      data: [
        state ? midiNoteOn : midiNoteOff,
        key + this.currentOctave * 12,
        127 // Max velocity.
      ]
    });
  }

  /**
   * On load attach a handler for midi events to every midi device.
   */
  componentWillMount() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midiAccess) => {
        midiAccess.inputs.forEach(device => {
          device.onmidimessage = this.onMidiMessage;
        });
      }, (error) => {
        console.log(error);
      });
    }
  }

  componentDidMount() {
    const keyboard = this.keyboardRef.current as HTMLDivElement;
    const octaves = Math.ceil(keyboard.offsetWidth / 240);
    this.currentOctave = 6 - Math.floor(octaves / 2);
    this.setKeys(octaves * 12);
    this.setState({})
  }

  render() {
    return <div className="keyboard"
      ref={this.keyboardRef}
      >
      {this.keyboardKeys.map((key) => 
        <MidiKeyboardKey key={key} 
          note={key + this.currentOctave * 12}
          isActive={this.state.activeKeys.some(k => k === key + this.currentOctave * 12)}
          onToggleNote={(state: boolean) => this.toggleNote(key, state)}/>
      )}
    </div>
  }
}
