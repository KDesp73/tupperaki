"use client";

import { useState } from "react";
import TupperPlot from "@/components/local/TupperPlot";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Using standard shadcn input
import { BITMAP_HEIGHT, BITMAP_WIDTH, FORMULA_Y_OFFSET } from "@/lib/tupper";
import { Compass, Hash, RotateCcw, Copy, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ExplorerPage() {
  const params = useSearchParams();
  const paramYOffset = params.get("offset");

  const [yOffset, setYOffset] = useState<bigint>(paramYOffset ? BigInt(paramYOffset) : FORMULA_Y_OFFSET);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(yOffset.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <main className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        
        <Card className="shadow-sm shrink-0 border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 space-y-4">
            
            <div className="flex items-center justify-between">
              <Label htmlFor="y-offset" className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-2">
                <Hash className="h-3 w-3" /> Base Y Offset
              </Label>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                {yOffset.toString().length} Digits
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* THE RESTORED INPUT BOX */}
              <div className="relative flex-1 group">
                <Input
                  id="y-offset"
                  value={yOffset.toString()}
                  onChange={(e) => {
                    try {
                      const val = e.target.value.replace(/\D/g, ""); // Keep only digits
                      if (val) setYOffset(BigInt(val));
                    } catch {}
                  }}
                  className="font-mono text-xs h-12 bg-muted/50 tabular-nums tracking-tight overflow-x-auto pr-12 focus-visible:ring-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1.5 h-9 w-9 hover:bg-background" 
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 opacity-50" />}
                </Button>
              </div>

              {/* Action Area */}
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/30 px-3 py-3 rounded-md border border-dashed whitespace-nowrap">
                  <Compass className="h-3 w-3 text-primary" />
                  <span>Scroll traverses Y • Drag pans X</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-12 px-6 font-bold shrink-0"
                  onClick={() => setYOffset(FORMULA_Y_OFFSET)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Plot Workspace */}
        <div className="flex-1 bg-muted/10 rounded-xl border border-border/50 flex items-center justify-center p-2 relative overflow-hidden shadow-inner">
          <div className="w-full h-full flex items-center justify-center">
             <div className="w-full shadow-2xl rounded-lg overflow-hidden border bg-card">
                <TupperPlot
                  bitmapWidth={BITMAP_WIDTH}
                  bitmapHeight={BITMAP_HEIGHT}
                  scale={10} 
                  yOffset={yOffset}
                />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
