"use client";

import { useState, useEffect } from "react";
import TupperCanvas from "@/components/local/TupperCanvas";
import TupperPlot from "@/components/local/TupperPlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeBitmapY, FORMULA_Y_OFFSET } from "@/lib/tupper";

export default function TupperExplorer() {
  const bitmapWidth = 106; // <- fits the formula exactly
  const bitmapHeight = 17;
  const gridCellSize = 20;

  const [bitmap, setBitmap] = useState(
    Array.from({ length: bitmapHeight }, () => Array(bitmapWidth).fill(0))
  );

  const [scale, setScale] = useState(20);
  const [computedY, setComputedY] = useState<bigint>(
    computeBitmapY(bitmap)
  );
  const [yOffset, setYOffset] = useState<bigint>(computedY);

  // Recompute computedY whenever bitmap changes
  useEffect(() => {
    setComputedY(computeBitmapY(bitmap));
  }, [bitmap]);

  const copyY = () => navigator.clipboard.writeText(computedY.toString());

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <Label>Y Offset</Label>
        <Input
          value={yOffset.toString()}
          onChange={(e) => {
            try {
              setYOffset(BigInt(e.target.value));
            } catch {}
          }}
          className="w-64"
        />

        <Label>Computed Y</Label>
        <Input value={computedY.toString()} readOnly className="w-96" />

        <Button onClick={copyY}>Copy</Button>
        <Button onClick={() => setYOffset(FORMULA_Y_OFFSET)}>Formula</Button>
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
        <Button
          onClick={() =>
            setBitmap(
              Array.from({ length: bitmapHeight }, () =>
                Array(bitmapWidth).fill(1)
              )
            )
          }
        >
          Fill All
        </Button>
      </div>

      {/* Scale slider */}
      <div className="flex items-center gap-4">
        <Label>Zoom</Label>
        <Input
          type="range"
          min={4}
          max={40}
          step={1}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-64"
        />
        <span className="w-10 text-right">{scale}</span>
      </div>

      {/* Drawing canvas */}
      <TupperCanvas
        bitmap={bitmap}
        setBitmap={setBitmap}
        bitmapWidth={bitmapWidth}
        bitmapHeight={bitmapHeight}
        gridCellSize={gridCellSize}
      />

      {/* Tupper plot */}
      <TupperPlot
        bitmapWidth={bitmapWidth}
        bitmapHeight={bitmapHeight}
        scale={scale}
        yOffset={computedY | yOffset}
      />
    </div>
  );
}
