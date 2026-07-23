import Link from "next/link";
import { games } from "@/lib/mockData";
import { buildCategories } from "@/lib/categories";
import GameSection from "@/components/GameSection";

export default function Home() {
  const categories = buildCategories(games);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Entdecke Roblox&apos;s nächste große Hits — bevor es alle anderen tun.
        </h1>
        <p className="max-w-2xl text-foreground/60">
          Hidden Gems zeigt ausschließlich kleine, wachstumsstarke Roblox-Spiele mit
          offiziellem Discord-Server. Kein Rauschen, keine bereits etablierten
          Blockbuster — nur Spiele mit echtem Potenzial.
        </p>
        <Link
          href="/search"
          className="mt-2 w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Alle Hidden Gems durchsuchen
        </Link>
      </section>

      {categories.map((category) => (
        <GameSection key={category.key} category={category} />
      ))}
    </div>
  );
}
