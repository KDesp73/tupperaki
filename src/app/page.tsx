"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Header */}
      <h1 className="text-4xl font-bold text-center">
        Tupper's Self-Referential Formula Explorer
      </h1>

      {/* Introduction */}
      <div className="max-w-3xl text-center text-gray-700 space-y-4">
        <p>
          Tupper's self-referential formula is a famous mathematical equation that can encode
          any bitmap image as a single extremely large number. Remarkably, when plotted,
          the formula reproduces the bitmap exactly — including its own graph!
        </p>
        <p>
          This tool allows you to explore the incredible world of Tupper's formula. You can:
        </p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-2">
          <li>Draw your own bitmaps and compute the corresponding Y value.</li>
          <li>Explore the plane of the formula by adjusting the Y offset and zooming.</li>
          <li>Visualize how the formula reproduces any image you encode.</li>
        </ul>
        <p>
          The self-referential nature of the formula makes it both a mathematical curiosity
          and a fun visualization tool.
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/draw">
          <Button className="px-6 py-3 text-lg">Draw Bitmaps</Button>
        </Link>
        <Link href="/explore">
          <Button className="px-6 py-3 text-lg">Explore Tupper Formula</Button>
        </Link>
      </div>

      {/* Footer / reference */}
      <div className="max-w-2xl text-center text-gray-500 mt-12 text-sm">
        <p>
          Inspired by Jeff Tupper's self-referential formula. Learn more about the math behind
          it in <a className="text-blue-600 underline" href="https://en.wikipedia.org/wiki/Tupper%27s_self-referential_formula" target="_blank">Wikipedia</a>.
        </p>
      </div>
    </>
  );
}
