import { useRef, useState, useEffect } from "react";

interface TupperPlotProps {
  bitmapWidth: number;
  bitmapHeight: number;
  scale: number;
  bitmap: number[][];
}

export default function TupperPlot({
  bitmapWidth,
  bitmapHeight,
  scale,
  bitmap,
}: TupperPlotProps) {
  const tupperCanvasRef = useRef<HTMLCanvasElement>(null);

  const computeBitmapY = (bitmap: number[][]): bigint => {
    let y = BigInt(0);
    for (let col = 0; col < bitmap[0].length; col++) {
      for (let row = 0; row < bitmapHeight; row++) {
        const tupperRow = bitmapHeight - 1 - row;
        if (bitmap[row][col]) y += BigInt(2) ** (BigInt(17 * col) + BigInt(tupperRow));
      }
    }
    return y;
  };

  const [yOffset, setYOffset] = useState<bigint>(computeBitmapY(bitmap));
  const [isPanning, setIsPanning] = useState(false);
  const panStartY = useRef(0);
  const panStartYOffset = useRef<bigint>(computeBitmapY(bitmap));

  useEffect(() => {
    setYOffset(computeBitmapY(bitmap));
  }, [bitmap]);

  const tupperPixel = (x: number, y: number) => {
    const Y = yOffset + BigInt(y);
    const Ydiv = Y / BigInt(17);
    const bitIndex = BigInt(17 * x) + (Y % BigInt(17));
    return ((Ydiv >> bitIndex) & BigInt(1)) === BigInt(1);
  };

  const renderTupper = () => {
    const canvas = tupperCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < bitmapWidth; x++) {
      for (let y = 0; y < bitmapHeight; y++) {
        const on = tupperPixel(x, y);
        ctx.fillStyle = on ? "black" : "white";
        ctx.fillRect(x * scale, (bitmapHeight - 1 - y) * scale, scale, scale);
      }
    }

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= bitmapWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, bitmapHeight * scale);
      ctx.stroke();
    }
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(bitmapWidth * scale, y * scale);
      ctx.stroke();
    }
  };

  useEffect(() => {
    renderTupper();
  }, [bitmap, yOffset, scale]);

  const handlePanStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    panStartY.current = e.clientY;
    panStartYOffset.current = yOffset;
  };
  const handlePanEnd = () => setIsPanning(false);
  const handlePanMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    const delta = BigInt(Math.round((e.clientY - panStartY.current) / scale));
    setYOffset(panStartYOffset.current - delta);
  };
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = BigInt(Math.sign(e.deltaY));
    setYOffset(yOffset + delta);
  };

  return (
    <canvas
      ref={tupperCanvasRef}
      width={bitmapWidth * scale}
      height={bitmapHeight * scale}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        imageRendering: "pixelated",
        cursor: "grab",
      }}
      onMouseDown={handlePanStart}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onMouseMove={handlePanMove}
      onWheel={handleWheel}
    />
  );
}
