export const computeBitmapY = (bitmap: number[][], bitmapHeight: number): bigint => {
  let y = 0n;
  for (let col = 0; col < bitmap[0].length; col++) {
    for (let row = 0; row < bitmapHeight; row++) {
      const tupperRow = bitmapHeight - 1 - row; // bottom row = 0
      if (bitmap[row][col]) y += 2n ** BigInt(17 * col + tupperRow);
    }
  }
  return y;
};
