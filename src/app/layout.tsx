import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { VERSION } from "@/lib/utils";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tupperaki",
  description: "Tupper's Self Referencial Formula Browser by KDesp73",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full font-sans bg-background text-foreground`}
      >
      <Suspense>
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />

        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between max-w-none px-6">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tighter">
                    TUPPER<span className="text-primary underline decoration-2 underline-offset-4">AKI</span>
                  </span>
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium">
                  <Link href="/draw" className="transition-colors hover:text-primary text-muted-foreground">
                    Studio
                  </Link>
                  <Link href="/explore" className="transition-colors hover:text-primary text-muted-foreground">
                    Explorer
                  </Link>
                </nav>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block px-2">
                  v{VERSION}
                </span>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <a 
                    href="https://github.com/KDesp73/tupperaki" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 flex flex-col relative">
            {children}
          </main>
        </div>
        </Suspense>
      </body>
    </html>
  );
}
