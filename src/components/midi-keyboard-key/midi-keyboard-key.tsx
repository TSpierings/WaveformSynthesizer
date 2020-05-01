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

  render() {
    return <button className="key"
      onMouseDown={() => this.toggleNote(true)}
      onMouseUp={() => this.toggleNote(false)}
      onMouseLeave={() => this.toggleNote(false)}/>
  }
}
