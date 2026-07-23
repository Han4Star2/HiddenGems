import { Game } from "./types";
import { getDeveloperForGame } from "./mockData";

export interface SearchFilters {
  query?: string;
  genre?: string;
  maxPlayers?: number;
  minGrowth7d?: number;
  minScore?: number;
  maxAgeDays?: number;
  minLikes?: number;
  minFavorites?: number;
}

export function ageInDays(game: Game): number {
  const created = new Date(game.createdAt).getTime();
  return Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
}

export function likeRate(game: Game): number {
  const total = game.likes + game.dislikes;
  if (total === 0) return 0;
  return (game.likes / total) * 100;
}

export function favoriteRatio(game: Game): number {
  if (game.visits === 0) return 0;
  return (game.favorites / game.visits) * 100;
}

export function searchGames(games: Game[], filters: SearchFilters): Game[] {
  return games.filter((game) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const developer = getDeveloperForGame(game);
      const matches =
        game.name.toLowerCase().includes(q) ||
        developer?.name.toLowerCase().includes(q) ||
        game.groupName?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (filters.genre && game.genre !== filters.genre) return false;
    if (filters.maxPlayers !== undefined && game.currentPlayers > filters.maxPlayers)
      return false;
    if (filters.minGrowth7d !== undefined && game.growth7d < filters.minGrowth7d)
      return false;
    if (filters.minScore !== undefined && game.hiddenGemScore < filters.minScore)
      return false;
    if (filters.maxAgeDays !== undefined && ageInDays(game) > filters.maxAgeDays)
      return false;
    if (filters.minLikes !== undefined && game.likes < filters.minLikes) return false;
    if (filters.minFavorites !== undefined && game.favorites < filters.minFavorites)
      return false;
    return true;
  });
}

export function allGenres(games: Game[]): string[] {
  return Array.from(new Set(games.map((g) => g.genre))).sort();
}
