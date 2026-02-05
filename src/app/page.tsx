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

  const [bitmap, setBitmap] = useState(
    Array.from({ length: bitmapHeight }, () => Array(bitmapWidth).fill(0))
  );

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

      {/* Drawing canvas */}
      <TupperCanvas
        bitmap={bitmap}
        setBitmap={setBitmap}
        bitmapWidth={bitmapWidth}
        bitmapHeight={bitmapHeight}
      />

      {/* Tupper plot */}
      <TupperPlot
        bitmapWidth={bitmapWidth}
        bitmapHeight={bitmapHeight}
        scale={20}
        yOffset={computedY == 0n ? yOffset : computedY}
      />
    </div>
  );
}
