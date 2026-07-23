import Link from "next/link";

export default function Navbar() {
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
          <button
            type="button"
            disabled
            title="Nutzerkonten kommen in einer späteren Version"
            className="cursor-not-allowed rounded-full border border-border px-4 py-1.5 text-sm text-foreground/40"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
