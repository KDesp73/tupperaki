"use client";

import TupperCanvas from "@/components/local/TupperCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BITMAP_HEIGHT, BITMAP_WIDTH, computeBitmapY } from "@/lib/tupper";
import { useEffect, useState } from "react";
import { Copy, Trash2, Maximize, ArrowLeft, Info } from "lucide-react";
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
    // Optional: Add a toast notification here
  };

  const clearBitmap = () => setBitmap(Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(0)));
  const fillBitmap = () => setBitmap(Array.from({ length: BITMAP_HEIGHT }, () => Array(BITMAP_WIDTH).fill(1)));

  return (
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Drawing Area */}
          <Card className="xl:col-span-3 shadow-sm border-slate-200">
            <CardHeader className="border-b bg-white">
              <CardTitle className="text-xl">Bitmap Studio</CardTitle>
              <CardDescription>
                Draw your pattern below. Left-click to paint, right-click to erase.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <TupperCanvas
                bitmap={bitmap}
                setBitmap={setBitmap}
                bitmapWidth={BITMAP_WIDTH}
                bitmapHeight={BITMAP_HEIGHT}
              />

              <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={clearBitmap} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button variant="outline" size="sm" onClick={fillBitmap}>
                  <Maximize className="mr-2 h-4 w-4" /> Fill All
                </Button>
            </div>
            </CardContent>
          </Card>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-md border-blue-100 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  Computed Y-Offset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative group">
                  <textarea
                    readOnly
                    value={computedY.toString()}
                    className="w-full h-48 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none h-12 bottom-0 rounded-b-lg" />
                </div>
                
                <Button onClick={copyY} className="w-full py-6 text-base font-semibold shadow-lg shadow-blue-200">
                  <Copy className="mr-2 h-5 w-5" /> Copy Y-Offset
                </Button>
                
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  This number represents the vertical position in the infinite Tupper plane where your image is located.
                </p>
              </CardContent>
            </Card>

            <Link href="/explore" className="block">
              <Button variant="secondary" className="w-full border border-slate-200">
                Test in Explorer
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
}
