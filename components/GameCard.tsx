import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/types";
import { getDeveloperForGame } from "@/lib/mockData";
import { formatCompactNumber, formatGrowth } from "@/lib/scoring";
import { ageInDays } from "@/lib/filters";
import ScoreBadge from "./ScoreBadge";
import DiscordButton from "./DiscordButton";
import SaveGameButton from "./SaveGameButton";

export default function GameCard({ game }: { game: Game }) {
  const developer = getDeveloperForGame(game);
  const age = ageInDays(game);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:bg-surface-hover"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={game.thumbnailUrl}
          alt={game.name}
          fill
          sizes="288px"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute right-2 top-2">
          <ScoreBadge score={game.hiddenGemScore} />
        </div>
        <div className="absolute left-2 top-2">
          <SaveGameButton gameId={game.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{game.name}</h3>
        </div>
        <p className="text-xs text-foreground/60">
          {developer?.name} · {game.genre} · {age}d alt
        </p>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-foreground/80">
            👥 {formatCompactNumber(game.currentPlayers)}
          </span>
          <span className={game.growth7d >= 0 ? "text-emerald-400" : "text-rose-400"}>
            {formatGrowth(game.growth7d)} / 7d
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <DiscordButton discord={game.discord} />
        </div>
      </div>
    </Link>
  );
}
