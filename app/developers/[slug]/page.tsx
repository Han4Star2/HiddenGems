import Image from "next/image";
import { notFound } from "next/navigation";
import { findDeveloperBySlug, findGamesForDeveloper } from "@/lib/dataSource";
import { formatCompactNumber, formatGrowth } from "@/lib/scoring";
import GameCard from "@/components/GameCard";
import FollowButton from "@/components/FollowButton";

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const developer = await findDeveloperBySlug(slug);
  if (!developer) notFound();

  const developerGames = await findGamesForDeveloper(developer.id);
  const totalPlayers = developerGames.reduce((sum, g) => sum + g.currentPlayers, 0);
  const totalVisits = developerGames.reduce((sum, g) => sum + g.visits, 0);
  const avgGrowth7d =
    developerGames.reduce((sum, g) => sum + g.growth7d, 0) / (developerGames.length || 1);

  const stats = [
    { label: "Hidden Gems", value: String(developerGames.length) },
    { label: "Gesamtspieler", value: formatCompactNumber(totalPlayers) },
    { label: "Gesamtbesuche", value: formatCompactNumber(totalVisits) },
    { label: "Ø Wachstum (7d)", value: formatGrowth(avgGrowth7d) },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
          {developer.avatarUrl && (
            <Image src={developer.avatarUrl} alt={developer.name} fill className="object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{developer.name}</h1>
          <p className="text-sm text-foreground/60">{developer.memberCount} Mitglieder</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {developer.discordUrl && (
            <a
              href={developer.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5865F2]/15 px-3 py-1.5 text-xs font-medium text-[#a6b0ff] hover:bg-[#5865F2]/25"
            >
              🎮 Offizieller Discord
            </a>
          )}
          <FollowButton developerId={developer.id} />
        </div>
      </div>

      <p className="max-w-3xl text-foreground/70">{developer.description}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-foreground/50">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Hidden Gems von {developer.name}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {developerGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
