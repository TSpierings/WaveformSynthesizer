import './waveform-editor.scss';
import * as React from 'react';
import { clamp } from 'util/clamp';

interface WaveformEditorState {
  waveformBuffer: Array<number>;
  editing: boolean;
}

/**
 * A component containing an editable canvas to create and export a waveform.
 */
export class WaveformEditor extends React.Component<{}, WaveformEditorState> {
  static waveBufferLength = 100;
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);

    this.canvasRef = React.createRef();

    this.state = {
      waveformBuffer: this.initWaveformBuffer(),
      editing: false
    }
  }

  /**
   * Initialize a waveform buffer of the default size and fill it with a perfect sine wave.
   * @returns An array of numbers representing the initialized waveform.
   */
  initWaveformBuffer(): Array<number> {
    const newBuffer = new Array<number>(WaveformEditor.waveBufferLength);

    for(let i = 0; i < newBuffer.length; i++) {
      newBuffer[i] = Math.sin(i * (Math.PI * 2 / WaveformEditor.waveBufferLength));
    }

    return newBuffer;
  }

  /**
   * Draw the waveform buffer on the canvas.
   */
  drawWaveform() {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const waveformBuffer = this.state.waveformBuffer;
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.beginPath();

    for(let i = 0; i < waveformBuffer.length; i++) {
      ctx.lineTo(i * (canvas.width / (waveformBuffer.length - 1)),
        canvas.height / 2 + waveformBuffer[i] * canvas.height / 2);
    }

    ctx.stroke();
  }  

  /**
   * Edit the waveform dependent on the touch position in the canvas.
   */
  onTouchMove = (event: React.TouchEvent) => {
    const canvas = this.canvasRef.current as HTMLCanvasElement;

    const touchX = event.touches[0].clientX - canvas.offsetLeft;
    const touchY = event.touches[0].clientY - canvas.offsetTop;
  
    this.editWaveform(touchX, touchY);
  }

  /**
   * Edit the waveform dependent on the mouse position in the canvas.
   */
  onMouseMove = (event: React.MouseEvent) => {
    if (!this.state.editing) {
      return;
    }

    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    this.editWaveform(mouseX, mouseY);
  }

  /**
   * Edit the waveform given a coordinate from the editor canvas.
   * This function will clamp the given values appropriately to the allowed boundaries.
   * @param pointX The x coordinate relative to the canvas.
   * @param pointY The y coordinate relative to the canvas.
   */
  editWaveform(pointX: number, pointY: number) {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;

    const x = clamp(
      Math.floor(pointX / width * this.state.waveformBuffer.length),
      0,
      WaveformEditor.waveBufferLength - 1);
    
    const newBuffer = this.state.waveformBuffer;
    newBuffer[x] = clamp(
      (pointY / height) * 2 - 1,
      -1,
      1);

    this.setState({
      waveformBuffer: newBuffer
    });
  }

  //#region Lifecycle functions
  componentDidMount() {
    this.drawWaveform();
  }

  componentDidUpdate() {
    this.drawWaveform();
  }
  //#endregion

  render() {
    return <div className='editor'>
      <canvas ref={this.canvasRef}
        width='500'
        height='500'
        onMouseMove={this.onMouseMove}
        onMouseDown={() => this.setState({editing: true})}
        onMouseUp={() => this.setState({editing: false})}
        onMouseLeave={() => this.setState({editing: false})}
        onTouchMove={this.onTouchMove}/>
    </div>
  }
}
