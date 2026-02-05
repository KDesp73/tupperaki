"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TupperExplorer() {
  const bitmapHeight = 17;
  const bitmapWidth = 50; // width of the drawing grid
  const gridCellSize = 20; // pixels per cell for drawing canvas

  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const tupperCanvasRef = useRef<HTMLCanvasElement>(null);

  const [bitmap, setBitmap] = useState(
    Array.from({ length: bitmapHeight }, () => Array(bitmapWidth).fill(0))
  );
  const [drawing, setDrawing] = useState(false);
  const [scale, setScale] = useState(20);
  const [yOffset, setYOffset] = useState<bigint>(0n);

  // For vertical panning
  const [isPanning, setIsPanning] = useState(false);
  const panStartY = useRef(0);
  const panStartYOffset = useRef<bigint>(0n);

  // Compute Y from bitmap
  const computeBitmapY = (bitmap: number[][]): bigint => {
    let y = 0n;
    for (let col = 0; col < bitmap[0].length; col++) {
      for (let row = 0; row < bitmapHeight; row++) {
        if (bitmap[row][col]) y += 2n ** BigInt(row + bitmapHeight * col);
      }
    }
    return y;
  };
  const [computedY, setComputedY] = useState<bigint>(computeBitmapY(bitmap));
  useEffect(() => {
    setComputedY(computeBitmapY(bitmap));
  }, [bitmap]);

  // Tupper formula evaluation
  const tupperPixel = (x: bigint, y: bigint) => {
    const yDiv = y / 17n;
    const bitIndex = 17n * x + (y % 17n);
    return ((yDiv >> bitIndex) & 1n) === 1n;
  };

  // === DRAWING CANVAS ===
  const drawDrawingCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw filled cells
    for (let y = 0; y < bitmapHeight; y++) {
      for (let x = 0; x < bitmapWidth; x++) {
        if (bitmap[y][x]) {
          ctx.fillStyle = "black";
          ctx.fillRect(
            x * gridCellSize,
            y * gridCellSize,
            gridCellSize,
            gridCellSize
          );
        }
      }
    }

    // Draw grid
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

  const handleDrawMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridCellSize);
    const y = Math.floor((e.clientY - rect.top) / gridCellSize);

    if (x < 0 || x >= bitmapWidth || y < 0 || y >= bitmapHeight) return;

    const newBitmap = bitmap.map((row) => [...row]);

    if (e.buttons === 1) {
      // Left click = draw
      newBitmap[y][x] = 1;
    } else if (e.buttons === 2) {
      // Right click = erase
      newBitmap[y][x] = 0;
    }

    setBitmap(newBitmap);
  };

  useEffect(() => {
    drawDrawingCanvas();
  }, [bitmap]);

  // === TUPPER CANVAS ===
  const renderTupper = () => {
    const canvas = tupperCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < bitmapWidth; x++) {
      for (let y = 0; y < bitmapHeight; y++) {
        const on = tupperPixel(BigInt(x), yOffset + BigInt(y));
        ctx.fillStyle = on ? "black" : "white";
        ctx.fillRect(x * scale, (bitmapHeight - 1 - y) * scale, scale, scale);
      }
    }

    // Draw grid
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
  }, [yOffset, scale]);

  // === PAN HANDLERS ===
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

  const copyY = () => navigator.clipboard.writeText(computedY.toString());

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Button
          onClick={() =>
            setBitmap(
              Array.from({ length: bitmapHeight }, () =>
                Array(bitmapWidth).fill(0)
              )
            )
          }
        >
          Clear
        </Button>

        <Label htmlFor="scaleInput">Scale:</Label>
        <Input
          id="scaleInput"
          type="number"
          value={scale}
          onChange={(e) => setScale(parseInt(e.target.value))}
          className="w-20"
        />

        <Label htmlFor="yInput">Y Offset:</Label>
        <Input
          id="yInput"
          type="text"
          value={yOffset.toString()}
          onChange={(e) => setYOffset(BigInt(e.target.value))}
          className="w-40"
        />

        <Label>Computed Y:</Label>
        <Input
          type="text"
          value={computedY.toString()}
          readOnly
          className="w-80"
        />
        <Button onClick={copyY}>Copy Y</Button>
      </div>

      {/* Drawing canvas */}
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
        onContextMenu={(e) => e.preventDefault()} // disable context menu
      />

      {/* Tupper canvas */}
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
    </div>
  );
}
