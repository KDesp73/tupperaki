"use client";

import TupperCanvas from "@/components/local/TupperCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BITMAP_HEIGHT, BITMAP_WIDTH, computeBitmapY } from "@/lib/tupper";
import { useEffect, useState } from "react";
import { Copy, Trash2, Maximize, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DrawPage() {
  const [bitmap, setBitmap] = useState(
    Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(0))
  );

  const [computedY, setComputedY] = useState<bigint>(computeBitmapY(bitmap));

  useEffect(() => {
    setComputedY(computeBitmapY(bitmap));
  }, [bitmap]);

  const copyY = () => {
    navigator.clipboard.writeText(computedY.toString());
  };

  const clearBitmap = () => setBitmap(Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(0)));
  const fillBitmap = () => setBitmap(Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(1)));

  return (
    <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* Main Drawing Area */}
          <Card className="xl:col-span-3 shadow-sm border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl tracking-tight">Bitmap Studio</CardTitle>
                  <CardDescription>
                    Paint your pixels. The formula updates in real-time.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearBitmap} 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={fillBitmap}>
                    <Maximize className="mr-2 h-4 w-4" /> Fill All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 md:p-8 bg-background/50">
                <TupperCanvas
                  bitmap={bitmap}
                  setBitmap={setBitmap}
                  bitmapWidth={BITMAP_WIDTH}
                  bitmapHeight={BITMAP_HEIGHT}
                  // Assuming gridCellSize is handled internally by your 100% width TupperCanvas
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                  <Info className="mr-2 h-4 w-4 text-primary" />
                  Computed Y-Offset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <textarea
                    readOnly
                    value={computedY.toString()}
                    className="w-full h-48 p-3 text-[10px] font-mono bg-muted/50 border rounded-md resize-none focus:outline-none transition-all"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted/80 to-transparent rounded-b-md pointer-events-none" />
                </div>
                
                <Button onClick={copyY} className="w-full font-bold tracking-tight">
                  <Copy className="mr-2 h-4 w-4" /> Copy Coordinate
                </Button>
              </CardContent>
            </Card>

            <Link href={`/explore?offset=${computedY}`} className="block">
              <Button variant="outline" className="w-full justify-between group">
                Open in Explorer
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>

            <p className="px-2 text-[10px] text-muted-foreground leading-relaxed">
              This BigInt maps to a specific vertical slice in the infinite Tupper quadrant. 
              The height of this bitmap is exactly 17 pixels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
