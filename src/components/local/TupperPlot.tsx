import { tupperPixel } from "@/lib/tupper";
import { useEffect, useRef, useState } from "react";

interface Props {
  bitmapWidth: number;
  bitmapHeight: number;
  scale: number;
  yOffset: bigint;
}

export default function TupperPlot({
  bitmapWidth,
  bitmapHeight,
  scale,
  yOffset,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // x: column index, y: multiples of 17
  const [pan, setPan] = useState({ x: 0, y: 0n });
  const [isDragging, setIsDragging] = useState(false);
  
  // Track accumulated movement to avoid "ghosting" or skipping bits
  const dragAccumulator = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    dragAccumulator.current = { x: 0, y: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    dragAccumulator.current.x += dx;
    dragAccumulator.current.y += dy;

    // Only update state when we've moved enough to cross a full cell
    const xShift = Math.trunc(dragAccumulator.current.x / scale);
    const yShift = Math.trunc(dragAccumulator.current.y / scale);

    if (xShift !== 0 || yShift !== 0) {
      setPan((prev) => ({
        x: prev.x - xShift,
        // Move UP in plane means INCREASE yOffset
        y: prev.y + BigInt(yShift),
      }));

      // Keep the remainder for smooth continuous dragging
      dragAccumulator.current.x %= scale;
      dragAccumulator.current.y %= scale;
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1n : 1n;
      setPan((prev) => ({ ...prev, y: prev.y + direction }));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = container.clientWidth;
    const canvasHeight = bitmapHeight * scale;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const viewCols = Math.ceil(canvasWidth / scale);
    
    // Tupper's y ranges from [k, k+17]. 
    // We adjust k based on pan.y * 17.
    const currentK = yOffset + (pan.y * BigInt(bitmapHeight));

    for (let x = 0; x < viewCols; x++) {
      for (let y = 0; y < bitmapHeight; y++) {
        // mathX shifts left/right in the infinite plane
        const mathX = x + pan.x;
        // mathY is 0-16 within the current k-band
        const mathY = y; 

        const on = tupperPixel(mathX, mathY, currentK);

        ctx.fillStyle = on ? "black" : "white";

        // Rotated 180 degrees visually
        const drawX = (viewCols - 1 - x) * scale;
        const drawY = y * scale;

        ctx.fillRect(drawX, drawY, scale, scale);
      }
    }

    // Grid rendering
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= viewCols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(canvasWidth, y * scale);
      ctx.stroke();
    }
  }, [bitmapHeight, yOffset, scale, pan]);

  return (
    <div 
      ref={containerRef} 
      className="w-full relative overflow-hidden bg-white border rounded-lg touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        height: `${bitmapHeight * scale}px` 
      }}
    >
      <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />
      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded pointer-events-none font-mono">
        X-Offset: {(BigInt(pan.x) * BigInt(bitmapHeight)).toString().slice(0, 30)}...
        Y-Offset: {(yOffset + (pan.y * BigInt(bitmapHeight))).toString().slice(0, 30)}...
      </div>
    </div>
  );
}
