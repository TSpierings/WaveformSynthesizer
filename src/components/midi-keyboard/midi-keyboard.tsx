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

    this.keyboardKeys = new Array(87);
    for(let i = 0; i < 87; i++) {
      this.keyboardKeys[i] = i;
    }
  }

  toggleNote = (key: number, state: boolean) => {
    this.props.onMidiMessage({
      data: [
        state ? midiNoteOn : midiNoteOff,
        key + this.firstKey, // 21 is the first note on our keyboard (C0)
        127 // Max velocity
      ]
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
