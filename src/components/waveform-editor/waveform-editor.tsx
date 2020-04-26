import './waveform-editor.scss';
import * as React from 'react';

interface WaveformEditorState {
  waveformBuffer: Array<number>;
}

export class WaveformEditor extends React.Component<{}, WaveformEditorState> {
  // Ammount of samples a waveform has.
  static waveBufferLength = 500;

  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);

    this.canvasRef = React.createRef();

    this.state = {
      waveformBuffer: this.initWaveformBuffer()
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
      ctx.lineTo(i * (canvas.width / waveformBuffer.length), canvas.height / 2 + waveformBuffer[i] * canvas.height / 2);
    }

    ctx.stroke();
  }

  componentDidMount() {
    this.drawWaveform();
  }

  render() {
    return <div className='editor'>
      <canvas ref={this.canvasRef} width={WaveformEditor.waveBufferLength} height={WaveformEditor.waveBufferLength}/>
    </div>
  }
}
