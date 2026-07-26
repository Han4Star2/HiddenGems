/**
 * Ingestion-Pipeline: lädt ein Spiel live von Roblox, prüft das
 * Hidden-Gem-Kernkriterium (offizieller Discord in Spiel- oder
 * Gruppenbeschreibung) und berechnet Wachstum + Hidden-Gem-Score aus dem
 * gespeicherten Verlauf. Wird ein Spiel eingelesen, das (mehr) keinen
 * offiziellen Discord hat, wird es NICHT gespeichert bzw. bei einem
 * Refresh automatisch wieder entfernt — siehe AGENTS.md.
 *
 * Ungetestet gegen die echte Roblox-API (kein Netzwerkzugriff in dieser
 * Sandbox), aber lib/robloxApi.ts, lib/discord.ts und lib/hiddenGemScore.ts
 * sind bereits einzeln verifiziert.
 */

import {
  getUniverseIdFromPlaceId,
  getGameSnapshot,
  getGroupInfo,
  getGroupIconUrl,
} from "./robloxApi";
import { detectOfficialDiscord } from "./discord";
import { calculateHiddenGemScore } from "./hiddenGemScore";
import { Game, Developer, StatPoint } from "./types";

export class NoOfficialDiscordError extends Error {
  constructor() {
    super(
      "Kein offizieller Discord in Spiel- oder Gruppenbeschreibung gefunden — Spiel wird nicht aufgenommen."
    );
    this.name = "NoOfficialDiscordError";
  }
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `game-${Date.now()}`;
}

function daysBetween(fromIso: string, toIso: string): number {
  const diff = new Date(toIso).getTime() - new Date(fromIso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function growthSince(history: StatPoint[], days: number): number {
  if (history.length < 2) return 0;
  const latest = history[history.length - 1];
  const latestTime = new Date(latest.date).getTime();
  const targetTime = latestTime - days * 24 * 60 * 60 * 1000;

  let reference = history[0];
  for (const point of history) {
    if (new Date(point.date).getTime() <= targetTime) reference = point;
  }
  if (reference.players === 0) return 0;
  return ((latest.players - reference.players) / reference.players) * 100;
}

export interface IngestGameOptions {
  placeId: number;
  groupId?: number;
  genre?: string;
  editorsPick?: boolean;
}

/**
 * `previous` ist der zuletzt gespeicherte Stand desselben Spiels (falls
 * vorhanden) — daraus wird der Statistik-Verlauf fortgeschrieben, damit
 * Wachstum berechenbar bleibt. Beim ersten Import ist `previous` undefined
 * und Wachstum startet bei 0.
 */
export async function ingestGameFromRoblox(
  options: IngestGameOptions,
  previous?: Game
): Promise<Game> {
  const universeId = await getUniverseIdFromPlaceId(options.placeId);
  const snapshot = await getGameSnapshot(universeId, options.groupId);

  const discord = detectOfficialDiscord({
    gameDescription: snapshot.details.description,
    groupDescription: snapshot.group?.description,
  });

  if (!discord.found) {
    throw new NoOfficialDiscordError();
  }

  const today = new Date().toISOString().slice(0, 10);
  const todaysPoint: StatPoint = {
    date: today,
    players: snapshot.details.playing,
    visits: snapshot.details.visits,
    favorites: snapshot.favoritesCount,
  };

  // Bei mehrfachem Import am selben Tag wird der Tagespunkt aktualisiert statt dupliziert.
  const historyWithoutToday = (previous?.statHistory ?? []).filter((p) => p.date !== today);
  const statHistory = [...historyWithoutToday, todaysPoint].slice(-90);

  const growth24h = growthSince(statHistory, 1);
  const growth7d = growthSince(statHistory, 7);
  const nowIso = new Date().toISOString();

  const score = calculateHiddenGemScore({
    currentPlayers: snapshot.details.playing,
    growth24h,
    growth7d,
    likes: snapshot.votes.upVotes,
    dislikes: snapshot.votes.downVotes,
    favorites: snapshot.favoritesCount,
    visits: snapshot.details.visits,
    ageDays: daysBetween(snapshot.details.created, nowIso),
    daysSinceLastUpdate: daysBetween(snapshot.details.updated, nowIso),
  });

  return {
    id: previous?.id ?? `roblox-${universeId}`,
    slug: previous?.slug ?? slugify(snapshot.details.name),
    name: snapshot.details.name,
    thumbnailUrl: snapshot.thumbnailUrl ?? previous?.thumbnailUrl ?? "",
    genre: options.genre ?? previous?.genre ?? "Sonstiges",
    description: snapshot.details.description,
    createdAt: snapshot.details.created,
    lastUpdatedAt: snapshot.details.updated,
    developerId: String(snapshot.details.creator.id),
    groupName: snapshot.group?.name,
    robloxUrl: `https://www.roblox.com/games/${options.placeId}`,
    robloxPlaceId: options.placeId,
    robloxCreatorType: snapshot.details.creator.type,
    currentPlayers: snapshot.details.playing,
    visits: snapshot.details.visits,
    likes: snapshot.votes.upVotes,
    dislikes: snapshot.votes.downVotes,
    favorites: snapshot.favoritesCount,
    growth24h,
    growth7d,
    hiddenGemScore: score.total,
    editorsPick: options.editorsPick ?? previous?.editorsPick ?? false,
    discord,
    statHistory,
  };
}

export async function ingestDeveloperFromGroup(
  groupId: number,
  previous?: Developer
): Promise<Developer> {
  const [group, avatarUrl] = await Promise.all([getGroupInfo(groupId), getGroupIconUrl(groupId)]);

  return {
    id: String(groupId),
    slug: previous?.slug ?? slugify(group.name),
    name: group.name,
    avatarUrl: avatarUrl ?? previous?.avatarUrl ?? "",
    memberCount: group.memberCount,
    description: group.description,
    discordUrl: detectOfficialDiscord({ groupDescription: group.description }).url,
    gameIds: previous?.gameIds ?? [],
  };
}
