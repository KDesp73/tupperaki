import { useEffect, useRef, useState } from "react";

interface TupperCanvasProps {
  bitmapWidth: number;
  bitmapHeight: number;
  gridCellSize: number;
  bitmap: number[][];
  setBitmap: (bitmap: number[][]) => void;
}

export default function TupperCanvas({
  bitmapWidth,
  bitmapHeight,
  gridCellSize,
  bitmap,
  setBitmap,
}: TupperCanvasProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const drawDrawingCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < bitmapHeight; y++) {
      for (let x = 0; x < bitmapWidth; x++) {
        if (bitmap[y][x]) {
          ctx.fillStyle = "black";
          /**
           * ARTIFICIAL ROTATION:
           * We draw the bitmap array upside down and backwards 
           * to align the UI with the way Tupper's math stores bits.
           */
          const drawX = (bitmapWidth - 1 - x) * gridCellSize;
          const drawY = (bitmapHeight - 1 - y) * gridCellSize;
          ctx.fillRect(drawX, drawY, gridCellSize, gridCellSize);
        }
      }
    }

    // Grid lines remain stationary
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= bitmapWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * gridCellSize, 0);
      ctx.lineTo(x * gridCellSize, bitmapHeight * gridCellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * gridCellSize);
      ctx.lineTo(bitmapWidth * gridCellSize, y * gridCellSize);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawDrawingCanvas();
  }, [bitmap]);

  const handleDrawMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Calculate raw grid coordinates from mouse position
    const rawX = Math.floor((e.clientX - rect.left) / gridCellSize);
    const rawY = Math.floor((e.clientY - rect.top) / gridCellSize);

    /**
     * INVERSE COORDINATE MAPPING:
     * We map the visual click back to the "true" math coordinate.
     * Click at Top-Left (0,0) -> Maps to array [MaxH][MaxW]
     */
    const x = bitmapWidth - 1 - rawX;
    const y = bitmapHeight - 1 - rawY;

    if (x < 0 || x >= bitmapWidth || y < 0 || y >= bitmapHeight) return;

    const newBitmap = bitmap.map((row) => [...row]);
    if (e.buttons === 1) newBitmap[y][x] = 1; // Left click draw
    if (e.buttons === 2) newBitmap[y][x] = 0; // Right click erase

    setBitmap(newBitmap);
  };

  return (
    <canvas
      ref={drawCanvasRef}
      width={bitmapWidth * gridCellSize}
      height={bitmapHeight * gridCellSize}
      style={{
        display: "block",
        imageRendering: "pixelated",
        marginBottom: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "crosshair",
      }}
      onMouseDown={(e) => {
        setDrawing(true);
        handleDrawMouse(e);
      }}
      onMouseUp={() => setDrawing(false)}
      onMouseLeave={() => setDrawing(false)}
      onMouseMove={handleDrawMouse}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
