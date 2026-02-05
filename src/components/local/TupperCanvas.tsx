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
          ctx.fillRect(x * gridCellSize, y * gridCellSize, gridCellSize, gridCellSize);
        }
      }
    }

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
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

    const x = Math.floor((e.clientX - rect.left) / gridCellSize);
    const y = Math.floor((e.clientY - rect.top) / gridCellSize);

    if (x < 0 || x >= bitmapWidth || y < 0 || y >= bitmapHeight) return;

    const newBitmap = bitmap.map((row) => [...row]);
    if (e.buttons === 1) newBitmap[y][x] = 1;
    if (e.buttons === 2) newBitmap[y][x] = 0;

    setBitmap(newBitmap);
  };

  return (
    <canvas
      ref={drawCanvasRef}
      width={bitmapWidth * gridCellSize}
      height={bitmapHeight * gridCellSize}
      style={{
        width: bitmapWidth * gridCellSize,
        height: bitmapHeight * gridCellSize,
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
