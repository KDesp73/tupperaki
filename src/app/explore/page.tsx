"use client";

import { useState } from "react";
import TupperPlot from "@/components/local/TupperPlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BITMAP_HEIGHT, BITMAP_WIDTH, FORMULA_Y_OFFSET } from "@/lib/tupper";

export default function ExplorerPage() {
  const [yOffset, setYOffset] = useState<bigint>(FORMULA_Y_OFFSET);


  return (<>
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
        <Button onClick={() => setYOffset(FORMULA_Y_OFFSET)}>Formula</Button>
      </div>

      {/* Tupper plot */}
      <TupperPlot
        bitmapWidth={BITMAP_WIDTH}
        bitmapHeight={BITMAP_HEIGHT}
        scale={11}
        yOffset={yOffset}
      />
    </>
  );
}

