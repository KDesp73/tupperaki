"use client";

import TupperCanvas from "@/components/local/TupperCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BITMAP_HEIGHT, BITMAP_WIDTH, computeBitmapY } from "@/lib/tupper";
import { useEffect, useState } from "react";

export default function DrawPage() {
  const [bitmap, setBitmap] = useState(
    Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(0))
  );

  const [computedY, setComputedY] = useState<bigint>(
    computeBitmapY(bitmap)
  );

  // Recompute computedY whenever bitmap changes
  useEffect(() => {
    setComputedY(computeBitmapY(bitmap));
  }, [bitmap]);


  const copyY = () => navigator.clipboard.writeText(computedY.toString());

  return (<>
      <div className="flex flex-wrap gap-4 items-center">
        <Label>Computed Y</Label>
        <Input value={computedY.toString()} readOnly className="w-96" />

        <Button onClick={copyY}>Copy</Button>
        <Button
          onClick={() =>
            setBitmap(
              Array.from({ length: BITMAP_HEIGHT }, () =>
                Array(BITMAP_WIDTH).fill(0)
              )
            )
          }
        >
          Clear
        </Button>
        <Button
          onClick={() =>
            setBitmap(
              Array.from({ length: BITMAP_HEIGHT }, () =>
                Array(BITMAP_WIDTH).fill(1)
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
        bitmapWidth={BITMAP_WIDTH}
        bitmapHeight={BITMAP_HEIGHT}
      />

  </>);
}
