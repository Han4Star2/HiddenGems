"use client";

import Link from "next/link";
import { useSession } from "./SessionProvider";

export default function Navbar() {
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span aria-hidden>💎</span>
          <span>Hidden Gems</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-foreground/70 sm:flex">
          <Link href="/" className="hover:text-foreground">
            Startseite
          </Link>
          <Link href="/search" className="hover:text-foreground">
            Suche
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-surface-hover"
              >
                {session.premium && <span title="Premium">⭐</span>}
                <span>{session.displayName}</span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/60 hover:bg-surface-hover"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <a
              href="/api/auth/roblox/login"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-black hover:opacity-90"
            >
              Mit Roblox anmelden
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
