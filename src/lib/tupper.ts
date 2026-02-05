export function computeBitmapY(bitmap: number[][]): bigint {
  const height = bitmap.length;
  const width = bitmap[0].length;
  let k = BigInt(0);

  // Tupper's formula packs pixels column-by-column
  // Starting from x = 0 (left) to width-1 (right)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // bitmap[y][x] where y=0 is top and y=16 is bottom
      // We need to invert 'y' so the "bottom" pixel is the lowest bit in the column
      const pixel = bitmap[height - 1 - y][x];
      
      if (pixel === 1) {
        // The bit position is (x * height) + y
        const exponent = BigInt(x * height + y);
        k += BigInt(2) ** exponent;
      }
    }
  }

  // The actual y-offset used in the formula is k * 17 (height)
  return k * BigInt(height);
}

export const tupperPixel = (x: number, row: number, yOffset: bigint) => {
  const Y = yOffset + BigInt(row);
  const Ydiv = Y / 17n;
  const bitIndex = 17n * BigInt(x);
  return ((Ydiv >> (bitIndex + BigInt(row))) & 1n) === 1n;
};

export const FORMULA_Y_OFFSET = 960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719n;
