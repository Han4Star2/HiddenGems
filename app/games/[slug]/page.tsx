import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getDeveloperForGame, getGameBySlug } from "@/lib/mockData";
import { ageInDays, favoriteRatio, likeRate } from "@/lib/filters";
import { formatCompactNumber, formatGrowth } from "@/lib/scoring";
import ScoreBadge from "@/components/ScoreBadge";
import DiscordButton from "@/components/DiscordButton";
import StatChart from "@/components/StatChart";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const developer = getDeveloperForGame(game);
  const age = ageInDays(game);
  const hourlyGrowth = game.growth24h / 24;

  const stats = [
    { label: "Aktuelle Spieler", value: formatCompactNumber(game.currentPlayers) },
    { label: "Visits", value: formatCompactNumber(game.visits) },
    { label: "Likes", value: formatCompactNumber(game.likes) },
    { label: "Favorites", value: formatCompactNumber(game.favorites) },
    { label: "Like-Rate", value: `${likeRate(game).toFixed(1)}%` },
    { label: "Favorites / Visits", value: `${favoriteRatio(game).toFixed(1)}%` },
    { label: "Wachstum / Stunde", value: formatGrowth(hourlyGrowth) },
    { label: "Wachstum / Tag", value: formatGrowth(game.growth24h) },
    { label: "Wachstum / Woche", value: formatGrowth(game.growth7d) },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80">
        <Image src={game.thumbnailUrl} alt={game.name} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <ScoreBadge score={game.hiddenGemScore} showLabel />
        </div>
        <p className="max-w-3xl text-foreground/70">{game.description}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/60">
          <span>Genre: {game.genre}</span>
          <span>Erstellt: {game.createdAt} ({age}d)</span>
          <span>Letztes Update: {game.lastUpdatedAt}</span>
          {developer && (
            <span>
              Entwickler:{" "}
              <Link href={`/developers/${developer.slug}`} className="text-accent hover:underline">
                {developer.name}
              </Link>
            </span>
          )}
          {game.groupName && <span>Gruppe: {game.groupName}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={game.robloxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Auf Roblox öffnen
          </a>
          <DiscordButton discord={game.discord} showSource />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-foreground/50">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatChart
          title="Spielerentwicklung"
          data={game.statHistory}
          dataKey="players"
          color="#34d399"
        />
        <StatChart
          title="Visit-Entwicklung"
          data={game.statHistory}
          dataKey="visits"
          color="#22d3ee"
        />
        <StatChart
          title="Favorite-Entwicklung"
          data={game.statHistory}
          dataKey="favorites"
          color="#f59e0b"
        />
      </div>
    </div>
  );
}
