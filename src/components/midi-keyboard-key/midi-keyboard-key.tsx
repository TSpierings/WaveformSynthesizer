import './midi-keyboard-key.scss';
import * as React from 'react';
import { isKeyBlack } from 'util/is-midi-key-black';

interface MidiKeyboardKeyProps {
  onToggleNote: Function,
  note: number;
  isActive: boolean;
}

export class MidiKeyboardKey extends React.Component<MidiKeyboardKeyProps, {}> {
  private black: boolean;

  constructor(props: MidiKeyboardKeyProps) {
    super(props)

    this.black = isKeyBlack(this.props.note);
  }

  /**
   * Toggle the note to the given state if the state is not the current state.
   */
  toggleNote = (on: boolean) => {
    this.props.onToggleNote(on);
  }

  /**
   * If the mouse enters the button and the left mousebutton is pressed, toggle the note on.
   */
  mouseEnter = (event: React.MouseEvent) => {
    const isLeftMousePressed = (event.nativeEvent.buttons & 1) === 1;
    if (isLeftMousePressed) {
      this.toggleNote(true);
    }    
  }

  /**
   * If the mouse leaves and the left mousebutton is pressed, toggle the note off.
   */
  mouseLeave = (event: React.MouseEvent) => {
    const isLeftMousePressed = (event.nativeEvent.buttons & 1) === 1;
    if (isLeftMousePressed) {
      this.toggleNote(false);
    }
  }

  render() {
    return <button className={`key ${this.black ? 'black' : ''} ${this.props.isActive ? 'active' : ''}`}
      onMouseDown={() => this.toggleNote(true)}
      onMouseUp={() => this.toggleNote(false)}
      onMouseLeave={this.mouseLeave}
      onMouseEnter={this.mouseEnter}
      onTouchStart={() => this.toggleNote(true)}
      onTouchEnd={() => this.toggleNote(false)}/>
  }
}
