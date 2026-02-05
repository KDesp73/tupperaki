import { useEffect, useRef, useState } from "react";

interface TupperCanvasProps {
  bitmapWidth: number;
  bitmapHeight: number;
  bitmap: number[][];
  setBitmap: (bitmap: number[][]) => void;
}

export default function TupperCanvas({
  bitmapWidth,
  bitmapHeight,
  bitmap,
  setBitmap,
}: TupperCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentCellSize, setCurrentCellSize] = useState(0);

  // Handle responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && drawCanvasRef.current) {
        const width = containerRef.current.clientWidth;
        const cellSize = width / bitmapWidth;
        setCurrentCellSize(cellSize);

        const canvas = drawCanvasRef.current;
        canvas.width = width;
        canvas.height = cellSize * bitmapHeight;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [bitmapWidth, bitmapHeight]);

  // Redraw when bitmap or size changes
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas || currentCellSize === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < bitmapHeight; y++) {
      for (let x = 0; x < bitmapWidth; x++) {
        if (bitmap[y][x]) {
          ctx.fillStyle = "black";
          // 180-degree mapping for Tupper logic
          const drawX = (bitmapWidth - 1 - x) * currentCellSize;
          const drawY = (bitmapHeight - 1 - y) * currentCellSize;
          // Use Math.ceil for the fill to prevent sub-pixel gaps in the grid
          ctx.fillRect(drawX, drawY, Math.ceil(currentCellSize), Math.ceil(currentCellSize));
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= bitmapWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * currentCellSize, 0);
      ctx.lineTo(x * currentCellSize, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * currentCellSize);
      ctx.lineTo(canvas.width, y * currentCellSize);
      ctx.stroke();
    }
  }, [bitmap, currentCellSize, bitmapWidth, bitmapHeight]);

  const handleDrawMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || currentCellSize === 0) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Calculate grid coordinates using the dynamic cell size
    const rawX = Math.floor((e.clientX - rect.left) / currentCellSize);
    const rawY = Math.floor((e.clientY - rect.top) / currentCellSize);

    // Inverse mapping to align with Tupper Plot logic
    const x = bitmapWidth - 1 - rawX;
    const y = bitmapHeight - 1 - rawY;

    if (x < 0 || x >= bitmapWidth || y < 0 || y >= bitmapHeight) return;

    const newBitmap = bitmap.map((row) => [...row]);
    if (e.buttons === 1) newBitmap[y][x] = 1;
    if (e.buttons === 2) newBitmap[y][x] = 0;

    setBitmap(newBitmap);
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={drawCanvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          imageRendering: "pixelated",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          cursor: "crosshair",
          touchAction: "none", // Prevents scrolling while drawing on mobile
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
    </div>
  );
}
