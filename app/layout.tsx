import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";

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
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="flex flex-col items-center gap-2 border-t border-border py-8 text-center text-sm text-foreground/50">
            <span>Hidden Gems · Kleine Roblox-Spiele mit großem Potenzial</span>
            <div className="flex gap-4 text-xs">
              <Link href="/privacy" className="hover:text-foreground/80">
                Datenschutz
              </Link>
              <Link href="/terms" className="hover:text-foreground/80">
                Nutzungsbedingungen
              </Link>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
