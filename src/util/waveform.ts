  /**
   * Initialize a waveform buffer of the given size and fill it with a perfect sine wave.
   * @returns An array of numbers representing the initialized waveform.
   */
  export function initSineWaveform(length: number): Array<number> {
    const newBuffer = new Array<number>(length);

    for(let i = 0; i < newBuffer.length; i++) {
      newBuffer[i] = Math.sin(i * (Math.PI * 2 / length));
    }

    return newBuffer;
  }
