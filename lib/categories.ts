import { Game } from "./types";
import { ageInDays } from "./filters";

export interface Category {
  key: string;
  emoji: string;
  title: string;
  games: Game[];
}

export function buildCategories(games: Game[]): Category[] {
  const fastestGrowing = [...games].sort((a, b) => b.growth7d - a.growth7d).slice(0, 8);

  const under100 = games
    .filter((g) => g.currentPlayers < 100)
    .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);

  const under500 = games
    .filter((g) => g.currentPlayers < 500)
    .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);

  const under1000 = games
    .filter((g) => g.currentPlayers < 1000)
    .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);

  const brandNew = [...games]
    .filter((g) => ageInDays(g) <= 30)
    .sort((a, b) => ageInDays(a) - ageInDays(b));

  const editorsPicks = games.filter((g) => g.editorsPick);

  return [
    { key: "fastest-growing", emoji: "🔥", title: "Fastest Growing", games: fastestGrowing },
    { key: "under-100", emoji: "💎", title: "Under 100 Players", games: under100 },
    { key: "under-500", emoji: "⭐", title: "Under 500 Players", games: under500 },
    { key: "under-1000", emoji: "🚀", title: "Under 1,000 Players", games: under1000 },
    { key: "brand-new", emoji: "🌱", title: "Brand New", games: brandNew },
    { key: "editors-picks", emoji: "👀", title: "Editor's Picks", games: editorsPicks },
  ];
}
