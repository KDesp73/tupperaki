import { tupperPixel } from "@/lib/tupper";
import { useEffect, useRef, useState } from "react";

interface Props {
  bitmapWidth: number;
  bitmapHeight: number;
  scale: number; // controlled by slider
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
  const [containerWidth, setContainerWidth] = useState(0);

  // Responsive width listener
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const effectiveScale = Math.min(scale, containerWidth / bitmapWidth);
    const canvasWidth = bitmapWidth * effectiveScale;
    const canvasHeight = bitmapHeight * effectiveScale;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels with 180-degree rotation
    for (let x = 0; x < bitmapWidth; x++) {
      for (let y = 0; y < bitmapHeight; y++) {
        // We still query the library with original x, y
        const on = tupperPixel(x, y, yOffset);

        ctx.fillStyle = on ? "black" : "white";

        /**
         * ARTIFICIAL 180-DEGREE ROTATION:
         * 1. Horizontal flip: (bitmapWidth - 1 - x)
         * 2. Vertical flip: In standard Canvas, y=0 is top. 
         * Since Tupper math y=0 is bottom, using 'y' directly 
         * effectively flips it compared to the original code.
         */
        const drawX = (bitmapWidth - 1 - x) * effectiveScale;
        const drawY = y * effectiveScale;

        ctx.fillRect(drawX, drawY, effectiveScale, effectiveScale);
      }
    }

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= bitmapWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * effectiveScale, 0);
      ctx.lineTo(x * effectiveScale, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= bitmapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * effectiveScale);
      ctx.lineTo(canvasWidth, y * effectiveScale);
      ctx.stroke();
    }
  }, [bitmapWidth, bitmapHeight, yOffset, scale, containerWidth]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          imageRendering: "pixelated",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
