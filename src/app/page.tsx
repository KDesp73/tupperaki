"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight, Paintbrush, Search } from "lucide-react"; // Assuming you have lucide-react

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 md:p-16 shadow-xl space-y-10 text-center">
        
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Tupper's <span className="text-blue-600">Self-Referential</span> Formula
          </h1>
        </header>

        {/* Introduction */}
        <div className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed space-y-6">
          <p>
            An equation that can encode <span className="font-semibold text-gray-900">any image</span> as a single, 
            astronomically large number. When plotted, the formula reproduces the image exactly — 
            including the formula itself.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <Paintbrush className="w-6 h-6 mb-2 text-blue-500" />
              <p className="font-medium text-gray-900 text-center">Draw Bitmaps</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <Search className="w-6 h-6 mb-2 text-blue-500" />
              <p className="font-medium text-gray-900 text-center">Explore Planes</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <div className="w-6 h-6 mb-2 font-bold text-blue-500 text-lg">Σ</div>
              <p className="font-medium text-gray-900 text-center">Compute Y</p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/draw" className="w-full sm:w-auto">
            <Button size="lg">
              Start Drawing <Paintbrush />
            </Button>
          </Link>
          <Link href="/explore" className="w-full sm:w-auto">
            <Button variant="outline" size="lg">
              Explore Formula <MoveRight />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer / reference */}
      <footer className="max-w-2xl text-center text-gray-400 mt-12 text-sm">
        <p>
          Inspired by Jeff Tupper's work. Read the 
          <a 
            className="text-gray-600 font-medium hover:text-blue-600 underline decoration-gray-300 ml-1 transition-colors" 
            href="https://en.wikipedia.org/wiki/Tupper%27s_self-referential_formula" 
            target="_blank"
          >
            Mathematical Proof on Wikipedia
          </a>.
        </p>
      </footer>
    </div>
  );
}
