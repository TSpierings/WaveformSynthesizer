import './harmonic-bar.scss';
import * as React from 'react';
import { clamp } from 'util/clamp';

export interface HarmonicBarprops {
  label: number
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

  mouseMove = (event: React.MouseEvent) => {
    if (this.isEditing) {
      const height = (this.harmonicRef.current as HTMLDivElement).clientHeight * 0.8; // Can only select the top 80% of the harmonic input.
      const input = event.nativeEvent.offsetY;
      const percentage = input / height;

      this.setState({
        value: clamp(1 - percentage, 0, 100) // Clamp to prevent clicks on the bottom 20%
      });
    }
    event.preventDefault();
  }

  touchStart = (event: React.TouchEvent) => {
    this.isEditing = true;
    this.touchMove(event);
  }

  touchMove = (event: React.TouchEvent) => {
    if (this.isEditing) {
      const element = this.harmonicRef.current as HTMLDivElement;
      
      const input = event.touches[0].clientY;
      const touchHeight = input - element.offsetTop;
      const percentage = touchHeight / (element.clientHeight * 0.8); // Can only select the top 80% of the harmonic input.

      this.setState({
        value: clamp(1 - percentage, 0, 100) // Clamp to prevent clicks on the bottom 20%
      });
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
          { height: `calc(${this.state.value * 80}%`}
        }/>
      <label>{this.props.label}</label>
    </div>
  }
}
