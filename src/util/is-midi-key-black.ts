const blackSemitones = [1, 3, 6, 8, 10];

/**
 * Check if a given key should be black or white.
 * @param note The MIDI note number
 */
export function isKeyBlack(note: number): boolean {
  const semitone = note % 12;
  return blackSemitones.some(k => k === semitone);
}
