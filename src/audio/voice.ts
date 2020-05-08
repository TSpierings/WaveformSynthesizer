/**
 * A Voice is one source node and one gain node, playing a waveform at a specific frequency and velocity.
 */
export class Voice {
  private gain: GainNode;
  private source: AudioBufferSourceNode;

  constructor(
    frequency: number,
    velocity: number,
    waveform: Array<number>,
    destination: AudioNode,
    context: AudioContext) {
    // Create gain node to set velocity.
    this.gain = context.createGain();
    this.gain.connect(destination);
    this.gain.gain.value = velocity;

    // Init source according to the given waveform and frequency.
    this.source = this.initAudiobufferSource(
      frequency,
      waveform,
      context);
    this.source.connect(this.gain);
    this.source.start();
  }

  /**
   * Stop source and disconnect nodes.
   */
  stop() {
    this.source.stop();
    this.source.disconnect();
    this.gain.disconnect();
  }

  /**
 * Initialize an AudioBufferSourceNode which will be filled with the waveform and played at the desired frequency.
 * It will be connected to the masterGainNode, so that should exist before this function is called.
 */
  private initAudiobufferSource(targetFrequency: number, waveform: Array<number>, context: AudioContext): AudioBufferSourceNode {
    const audioBufferSourceNode = context.createBufferSource();
    audioBufferSourceNode.connect(this.gain);
    audioBufferSourceNode.loop = true;

    const waveformFrequency = context.sampleRate / waveform.length;
    audioBufferSourceNode.playbackRate.value = targetFrequency / waveformFrequency;

    audioBufferSourceNode.buffer = this.createWaveformBuffer(waveform, context);

    return audioBufferSourceNode;
  }

  /**
   * Create an AudioBuffer from the waveform in state.
   */
  private createWaveformBuffer(waveform: Array<number>, context: AudioContext): AudioBuffer {
    const buffer = context.createBuffer(1, waveform.length, context.sampleRate);
    const bufferData = buffer.getChannelData(0);

    for (let i = 0; i < waveform.length; i++) {
      bufferData[i] = waveform[i];
    }

    return buffer;
  }
}
