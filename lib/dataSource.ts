/**
 * Kombiniert die statischen Mock-Daten mit echten, über lib/discovery.ts
 * eingelesenen Spielen/Entwicklern aus dem Blob-Store. Echte Einträge haben
 * bei Slug-Kollisionen Vorrang. Sobald genug echte Spiele eingelesen sind,
 * kann lib/mockData.ts hier einfach entfernt werden.
 */

import { games as mockGames, developers as mockDevelopers } from "./mockData";
import { listGames, getGame as getStoredGame } from "./gameStore";
import { listDevelopers } from "./developerStore";
import { Game, Developer } from "./types";

export async function getAllGames(): Promise<Game[]> {
  const real = await listGames();
  const realSlugs = new Set(real.map((g) => g.slug));
  return [...real, ...mockGames.filter((g) => !realSlugs.has(g.slug))];
}

export async function getAllDevelopers(): Promise<Developer[]> {
  const real = await listDevelopers();
  const realSlugs = new Set(real.map((d) => d.slug));
  return [...real, ...mockDevelopers.filter((d) => !realSlugs.has(d.slug))];
}

export async function findGameBySlug(slug: string): Promise<Game | undefined> {
  const stored = await getStoredGame(slug);
  if (stored) return stored;
  return mockGames.find((g) => g.slug === slug);
}

export async function findDeveloperBySlug(slug: string): Promise<Developer | undefined> {
  const all = await getAllDevelopers();
  return all.find((d) => d.slug === slug);
}

export async function findDeveloperForGame(game: Game): Promise<Developer | undefined> {
  const all = await getAllDevelopers();
  return all.find((d) => d.id === game.developerId);
}

export async function findGamesForDeveloper(developerId: string): Promise<Game[]> {
  const all = await getAllGames();
  return all.filter((g) => g.developerId === developerId);
}
