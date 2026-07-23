import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hidden Gems — Discover Roblox's Next Big Hits",
  description:
    "Hidden Gems zeigt ausschließlich kleine, wachstumsstarke Roblox-Spiele mit offiziellem Discord — kuratiert für Investoren, Publisher und Entwickler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-foreground/50">
          Hidden Gems · Kleine Roblox-Spiele mit großem Potenzial
        </footer>
      </body>
    </html>
  );
}
