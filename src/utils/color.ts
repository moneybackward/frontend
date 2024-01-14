export function generateRandomColorHex() {
  return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).slice(1, 7);
}

export function generateRandomColors(doNotUse: string[]) {
  let newColor = generateRandomColorHex();
  while (doNotUse.includes(newColor)) {
    newColor = generateRandomColorHex();
  }
  return newColor;
}
