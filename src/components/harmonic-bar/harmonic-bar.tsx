import './harmonic-bar.scss';
import * as React from 'react';
import { clamp } from 'util/clamp';

export interface HarmonicBarprops {
  label: number;
  onValueChange: Function;
}

export interface HarmonicBarState {
  value: number;
}

export class HarmonicBar extends React.Component<HarmonicBarprops, HarmonicBarState> {
  private isEditing = false;
  private harmonicRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.harmonicRef = React.createRef();

    this.state = {
      value: 0
    }
  }

  mouseDown = (event: React.MouseEvent) => {
    this.isEditing = true;
    this.mouseMove(event);
  }

  /**
   * When editing mode is active and the mouse moves over the element, calculate the offset from the bottom of the element
   * and set that as the new value.
   * If the user touches the bottom 20% of the element, the value is set to 0.
   */
  mouseMove = (event: React.MouseEvent) => {
    if (this.isEditing) {
      const height = (this.harmonicRef.current as HTMLDivElement).clientHeight * 0.8; // Can only select the top 80% of the harmonic input.
      const input = event.nativeEvent.offsetY;
      const percentage = input / height;
      const newValue = clamp(1 - percentage, 0, 1); // Clamp to prevent clicks on the bottom 20%.

      this.setState({
        value: newValue
      });
      this.props.onValueChange(newValue)
    }
    event.preventDefault();
  }

  touchStart = (event: React.TouchEvent) => {
    this.isEditing = true;
    this.touchMove(event);
  }

  /**
   * When editing mode is active and the user moves his finger over the screen, calculate the offset of the touch
   * from the bottom of the element and use it as the new value.
   * If the user touches the bottom 20% of the element, the value is set to 0.
   */
  touchMove = (event: React.TouchEvent) => {
    if (this.isEditing) {
      const element = this.harmonicRef.current as HTMLDivElement;
      
      const input = event.touches[0].clientY;
      const touchHeight = input - element.offsetTop;
      const percentage = touchHeight / (element.clientHeight * 0.8); // Can only select the top 80% of the harmonic input.
      const newValue = clamp(1 - percentage, 0, 1) // Clamp to prevent clicks on the bottom 20%.

      this.setState({
        value: newValue
      });
      this.props.onValueChange(newValue)
    }
  }

  stopInput = () => {
    this.isEditing = false;
  }

  render() {
    return <div ref={this.harmonicRef} className={`harmonic ${this.state.value === 0 ? 'disabled' : ''}`}
      onMouseDown={this.mouseDown}
      onMouseMove={this.mouseMove}
      onMouseLeave={this.stopInput}
      onMouseUp={this.stopInput}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
      onTouchEnd={this.stopInput}>
      <div className='bar'
        style={
          { height: `calc(${this.state.value * 80}%`} // Times 80 because the value is a percentage and we want to fill 80% of the container.
        }/>
      <label>{this.props.label}</label>
    </div>
  }
}
