import './midi-keyboard-key.scss';
import * as React from 'react';

interface MidiKeyboardKeyProps {
  onToggleNote: Function
}

interface MidiKeyboardKeyState {
  isActive: boolean
}

export class MidiKeyboardKey extends React.Component<MidiKeyboardKeyProps, MidiKeyboardKeyState> {

  constructor(props: MidiKeyboardKeyProps) {
    super(props)

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

  render() {
    return <button className="key"
      onMouseDown={() => this.toggleNote(true)}
      onMouseUp={() => this.toggleNote(false)}
      onMouseLeave={() => this.toggleNote(false)}
      onMouseEnter={this.mouseEnter}/>
  }
}
