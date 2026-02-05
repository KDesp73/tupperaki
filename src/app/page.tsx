"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const bitmapHeight = 17;
  const canvasWidth = 1000;

  // Refs
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const tupperCanvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [bitmap, setBitmap] = useState(
    Array.from({ length: bitmapHeight }, () => Array(canvasWidth).fill(0))
  );
  const [drawing, setDrawing] = useState(false);
  const [yOffset, setYOffset] = useState<BigInt>(0n);
  const [scale, setScale] = useState<number>(20);

  // Helper: bitmap -> Tupper Y
  const bitmapToTupperY = (bitmap: number[][]): BigInt => {
    let y = 0n;
    for (let col = 0; col < bitmap[0].length; col++) {
      for (let row = 0; row < bitmapHeight; row++) {
        if (bitmap[row][col]) {
          y += 2n ** BigInt(row + bitmapHeight * col);
        }
      }
    }
    return y;
  };

  // Helper: evaluate Tupper formula
  const tupperPixel = (x: BigInt, y: BigInt) => {
    const yDiv = y / 17n;
    const bitIndex = 17n * x + (y % 17n);
    return ((yDiv >> bitIndex) & 1n) === 1n;
  };

  // Drawing canvas handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = bitmapHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    if (x >= 0 && x < canvasWidth && y >= 0 && y < bitmapHeight) {
      const newBitmap = bitmap.map((row) => [...row]);
      newBitmap[y][x] = 1;
      setBitmap(newBitmap);
    }
  };

  // Render draw canvas
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / bitmapHeight;

    for (let y = 0; y < bitmapHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        if (bitmap[y][x]) {
          ctx.fillStyle = "black";
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [bitmap]);

  // Render Tupper canvas
  const renderTupper = () => {
    const canvas = tupperCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const widthPixels = canvasWidth;

    // Draw Tupper pixels
    for (let x = 0; x < widthPixels; x++) {
      for (let y = 0; y < bitmapHeight; y++) {
        const on = tupperPixel(BigInt(x), yOffset + BigInt(y));
        ctx.fillStyle = on ? "black" : "white";
        ctx.fillRect(x * scale, (bitmapHeight - 1 - y) * scale, scale, scale);
      }
    }

    // Draw grid overlay
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; // light gray grid
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= widthPixels; x++) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, bitmapHeight * scale);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(widthPixels * scale, y * scale);
      ctx.stroke();
    }
  };

  // Initial Y offset from bitmap
  useEffect(() => {
    setYOffset(bitmapToTupperY(bitmap));
  }, []);

  // Auto render when yOffset or scale changes
  useEffect(() => {
    renderTupper();
  }, [yOffset, scale]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Button onClick={() => setBitmap(Array.from({ length: bitmapHeight }, () => Array(canvasWidth).fill(0)))}>Clear</Button>
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
        <Button onClick={renderTupper}>Render Tupper Plot</Button>
      </div>

      <canvas
        ref={drawCanvasRef}
        width={canvasWidth}
        height={bitmapHeight}
        style={{ width: "2000px", height: "340px", imageRendering: "pixelated", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
        onMouseDown={() => setDrawing(true)}
        onMouseUp={() => setDrawing(false)}
        onMouseLeave={() => setDrawing(false)}
        onMouseMove={handleMouseMove}
      />

      <canvas
        ref={tupperCanvasRef}
        width={canvasWidth * scale}
        height={bitmapHeight * scale}
        style={{ border: "1px solid #ccc", borderRadius: "8px", imageRendering: "pixelated", cursor: "grab" }}
      />
    </div>
  );
}
