import './knob.scss';
import * as React from 'react';
import { clamp } from 'util/clamp';

export interface KnobProps {
  min: number;
  max: number;
  default: number;
  name: string;
  onValueChange: Function;
}

export interface KnobState {
  value: number;
}

export class Knob extends React.Component<KnobProps, KnobState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  private startValue = 0;
  private startY = 0;

  constructor(props: KnobProps) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      value: this.props.default
    }
  }

  startMouseInput = (event: React.MouseEvent) => {
    this.startY = event.clientY;
    this.startValue = this.state.value;
    window.addEventListener('mousemove', this.mouseMove, true);
    window.addEventListener('mouseup', this.endInput, true);
    event.preventDefault();
  }

  startTouchInput = (event: React.TouchEvent) => {
    this.startY = event.touches[0].clientY;
    this.startValue = this.state.value;
    window.addEventListener('touchmove', this.touchMove, true);
    window.addEventListener('touchend', this.endInput, true);
  }

  mouseMove = (event: MouseEvent) => {
    this.setValue(clamp(this.startValue + (this.startY - event.clientY), this.props.min, this.props.max))
  }

  touchMove = (event: TouchEvent) => {
    this.setValue(clamp(this.startValue + (this.startY - event.touches[0].clientY), this.props.min, this.props.max));
  }

  setValue(value: number) {
    this.setState({
      value: value
    });

    this.props.onValueChange(value);
  }

  endInput = () => {
    window.removeEventListener('mousemove', this.mouseMove, true);
    window.removeEventListener('mouseup', this.endInput, true);
    window.addEventListener('touchmove', this.touchMove, true);
    window.addEventListener('touchend', this.endInput, true);
  }

  calculateRotationPercentage(): number {
    const range = this.props.max - this.props.min;
    const value = this.state.value;
    return 30 + (value / range) * 300 // Rotation goes from 30deg to 330deg to make it look nice.
  }

  render() {
    return <div className='knob'>
      <input ref={this.inputRef} type='range' min={this.props.min} max={this.props.max} defaultValue={this.props.default}
        style={
          { transform: `rotate(${(this.calculateRotationPercentage())}deg)` }
        }
        onMouseDown={this.startMouseInput}
        onTouchStart={this.startTouchInput}/>
      <label>{this.props.name}</label>
    </div>
  }
}
