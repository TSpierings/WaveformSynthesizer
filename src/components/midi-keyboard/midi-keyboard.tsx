import './midi-keyboard.scss';
import * as React from 'react';
import { MidiKeyboardKey } from 'components/midi-keyboard-key/midi-keyboard-key';

interface MidiKeyboardProps {
  onPlayNote: Function
}

export class MidiKeyboard extends React.Component<MidiKeyboardProps, {}> {

  constructor(props: MidiKeyboardProps) {
    super(props)
  }

  playNote = (note: string) => {
    this.props.onPlayNote(note);
  }

  render() {
    return <div className="keyboard">
      <MidiKeyboardKey onToggleNote={() => this.playNote('A1')}/>
      <MidiKeyboardKey onToggleNote={() => this.playNote('A2')}/>
    </div>
  }
}
