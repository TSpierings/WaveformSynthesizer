import './midi-keyboard.scss';
import * as React from 'react';
import { MidiKeyboardKey } from 'components/midi-keyboard-key/midi-keyboard-key';

interface MidiKeyboardProps {
  onMidiMessage: Function
}

interface MidiKeyboardState {
  activeNotes: Array<number>;
}

const midiNoteOn = 144;
const midiNoteOff = 128;

export class MidiKeyboard extends React.Component<MidiKeyboardProps, MidiKeyboardState> {

  constructor(props: MidiKeyboardProps) {
    super(props)

    this.state = {
      activeNotes: new Array<number>()
    }
  }

  toggleNote = (note: number) => {
    if (this.state.activeNotes.some(n => n === note)) {
      this.props.onMidiMessage(this.createMidiMessage([midiNoteOff, note]));
      this.setState({
        activeNotes: this.state.activeNotes.filter(n => n != note)
      })
    } else {
      this.props.onMidiMessage(this.createMidiMessage([midiNoteOn, note, 127])); // 127 is max velocity
      this.setState({
        activeNotes: [...this.state.activeNotes, note]
      })
    }
  }

  createMidiMessage(data: any) {
    return {
      data: data
    }
  }

  render() {
    return <div className="keyboard">
      <MidiKeyboardKey onToggleNote={() => this.toggleNote(50)}/>
      <MidiKeyboardKey onToggleNote={() => this.toggleNote(100)}/>
    </div>
  }
}
