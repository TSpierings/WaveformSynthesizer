export function calculateFrequency(midiNote: number): number {
  return Math.pow(2, (midiNote - 69) / 12) * 440;
}
