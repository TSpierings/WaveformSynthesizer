import './midi-keyboard-key.scss';
import * as React from 'react';
import { isKeyBlack } from 'util/is-midi-key-black';

interface MidiKeyboardKeyProps {
  onToggleNote: Function,
  note: number;
}

interface MidiKeyboardKeyState {
  isActive: boolean
}

export class MidiKeyboardKey extends React.Component<MidiKeyboardKeyProps, MidiKeyboardKeyState> {
  private black: boolean;

  constructor(props: MidiKeyboardKeyProps) {
    super(props)

    this.black = isKeyBlack(this.props.note);

    this.state = {
      isActive: false
    }
  }

  /**
   * Toggle the note to the given state if the state is not the current state.
   */
  toggleNote = (state: boolean) => {
    if (this.state.isActive === state) {
      return;
    }

    this.setState({
      isActive: state
    });

    this.props.onToggleNote(state);
  }

  /**
   * If the mouse enters the button, toggle the note to the left mouse button state.
   */
  mouseEnter = (event: React.MouseEvent) => {
    const isLeftMousePressed = (event.nativeEvent.buttons & 1) === 1;
    this.toggleNote(isLeftMousePressed);
  }

  render() {
    return <button className={`key ${this.black ? 'black' : ''} ${this.state.isActive ? 'active' : ''}`}
      onMouseDown={() => this.toggleNote(true)}
      onMouseUp={() => this.toggleNote(false)}
      onMouseLeave={() => this.toggleNote(false)}
      onMouseEnter={this.mouseEnter}/>
  }
}
