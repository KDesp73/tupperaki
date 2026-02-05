import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center p-6">
        {children}
      </div>
      </body>
    </html>
  );
}
