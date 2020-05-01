import './midi-keyboard-key.scss';
import * as React from 'react';

interface MidiKeyboardKeyProps {
  onToggleNote: Function,
  note: number;
}

interface MidiKeyboardKeyState {
  isActive: boolean
}

export class MidiKeyboardKey extends React.Component<MidiKeyboardKeyProps, MidiKeyboardKeyState> {
  private static blackTones = [1, 3, 6, 8, 10];
  private black: boolean;

  constructor(props: MidiKeyboardKeyProps) {
    super(props)

    this.black = this.isBlack();

    this.state = {
      isActive: false
    }
  }

  toggleNote = (state: boolean) => {
    if (this.state.isActive === state) {
      return;
    }

    this.setState({
      isActive: state
    });

    this.props.onToggleNote(state);
  }

  mouseEnter = (event: React.MouseEvent) => {
    const isLeftMousePressed = (event.nativeEvent.buttons & 1) === 1;
    this.toggleNote(isLeftMousePressed);
  }

  isBlack = () => {
    const semitone = this.props.note % 12;
    return MidiKeyboardKey.blackTones.some(k => k === semitone);
  }

  render() {
    return <button className={`key ${this.black ? 'black' : ''} ${this.state.isActive ? 'active' : ''}`}
      onMouseDown={() => this.toggleNote(true)}
      onMouseUp={() => this.toggleNote(false)}
      onMouseLeave={() => this.toggleNote(false)}
      onMouseEnter={this.mouseEnter}/>
  }
}
