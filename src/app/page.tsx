"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight, Paintbrush, Search, Sigma } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="max-w-4xl w-full bg-card/50 backdrop-blur-sm border rounded-3xl p-8 md:p-16 shadow-xl space-y-10">
        
        <header className="space-y-4">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
            Tupperaki 
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Tupper's <span className="text-primary underline decoration-primary/30 underline-offset-8">Self-Referential</span> Formula Explorer
          </h1>
        </header>

        {/* Introduction */}
        <div className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed space-y-6">
          <p>
            An equation that can encode <span className="font-semibold text-foreground">any image</span> as a single, 
            astronomically large number. When plotted, the formula reproduces the image exactly — 
            including the formula itself.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex flex-col items-center hover:bg-muted transition-colors group">
              <Paintbrush className="w-6 h-6 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-bold text-foreground">Draw Bitmaps</p>
            </div>
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex flex-col items-center hover:bg-muted transition-colors group">
              <Search className="w-6 h-6 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-bold text-foreground">Explore Planes</p>
            </div>
            <div className="p-6 bg-muted/50 rounded-2xl border border-border flex flex-col items-center hover:bg-muted transition-colors group">
              <Sigma className="w-6 h-6 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-bold text-foreground">Compute Y</p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/draw" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 px-8 text-md font-bold rounded-xl gap-2 shadow-lg shadow-primary/20">
              Start Drawing <Paintbrush className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/explore" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-14 px-8 text-md font-bold rounded-xl gap-2 border-2">
              Explore Formula <MoveRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer / reference */}
      <footer className="max-w-2xl text-center text-muted-foreground mt-12 text-xs">
        <p>
          Inspired by Jeff Tupper's work. 
          <a 
            className="font-medium hover:text-primary underline decoration-muted-foreground/30 ml-1 transition-colors" 
            href="https://en.wikipedia.org/wiki/Tupper%27s_self-referential_formula" 
            target="_blank"
          >
            Find more info on the formula on Wikipedia
          </a>
        </p>
      </footer>
    </div>
  );
}
