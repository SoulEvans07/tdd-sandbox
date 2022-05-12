export function textToHue(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 6) - hash);
  }
  return Math.abs(hash) % 360;
}
