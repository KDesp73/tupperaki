"use client";

import { useState, useEffect } from "react";
import TupperCanvas from "@/components/local/TupperCanvas";
import TupperPlot from "@/components/local/TupperPlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeBitmapY } from "@/lib/tupper";

export default function TupperExplorer() {
  const bitmapWidth = 50;
  const bitmapHeight = 17;
  const gridCellSize = 20;
  const scale = 20;

  const [bitmap, setBitmap] = useState(
    Array.from({ length: bitmapHeight }, () => Array(bitmapWidth).fill(0))
  );

  const [computedY, setComputedY] = useState<bigint>(computeBitmapY(bitmap, bitmapHeight));
  const [yOffset, setYOffset] = useState<bigint>(computedY);

  // Recompute computedY whenever bitmap changes
  useEffect(() => {
    const y = computeBitmapY(bitmap, bitmapHeight);
    setComputedY(y);
  }, [bitmap]);

  // Update yOffset if user modifies input
  const handleYInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const val = BigInt(e.target.value);
      setYOffset(val);
    } catch {
      // ignore invalid input
    }
  };

  // Copy computed Y to clipboard
  const copyY = () => navigator.clipboard.writeText(computedY.toString());

  const setTo1 = () => {
    const filled = Array.from({length: bitmapHeight}, () => Array(bitmapWidth).fill(1))
    setBitmap(filled);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Button
          onClick={() =>
            setBitmap(
              Array.from({ length: bitmapHeight }, () => Array(bitmapWidth).fill(0))
            )
          }
        >
          Clear
        </Button>

        <Label htmlFor="yInput">Y Offset:</Label>
        <Input
          id="yInput"
          type="text"
          value={yOffset.toString()}
          onChange={handleYInputChange}
          className="w-40"
        />

        <Label>Computed Y:</Label>
        <Input type="text" value={computedY.toString()} readOnly className="w-80" />

        <Button onClick={copyY}>Copy Y</Button>
        <Button onClick={setTo1}>Fill All</Button>
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
        bitmap={bitmap}
        bitmapWidth={bitmapWidth}
        bitmapHeight={bitmapHeight}
        scale={scale}
        yOffset={yOffset}
      />
    </div>
  );
}
