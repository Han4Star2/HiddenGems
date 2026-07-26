/**
 * Roblox Public API Client
 *
 * Nutzt die öffentlichen (unauthentifizierten) Roblox-REST-Endpunkte, um
 * Spiel-, Gruppen- und Statistikdaten zu laden. In dieser Sandbox ist
 * ausgehender Netzwerkzugriff auf externe Hosts blockiert, dieser Client ist
 * daher ungetestet gegen die echte API — die Endpunkte/Response-Shapes
 * entsprechen der aktuellen öffentlichen Roblox-Dokumentation und sind so
 * gebaut, dass sie ohne Änderungen produktiv eingesetzt werden können.
 */

const GAMES_API = "https://games.roblox.com";
const APIS_API = "https://apis.roblox.com";
const GROUPS_API = "https://groups.roblox.com";
const THUMBNAILS_API = "https://thumbnails.roblox.com";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Roblox API request failed: ${res.status} ${res.statusText} (${url})`);
  }
  return res.json() as Promise<T>;
}

export interface RobloxGameDetails {
  id: number; // universeId
  name: string;
  description: string;
  creator: { id: number; type: "User" | "Group"; name: string };
  playing: number;
  visits: number;
  favoritedCount: number;
  created: string;
  updated: string;
}

interface GamesListResponse {
  data: RobloxGameDetails[];
}

export async function getUniverseIdFromPlaceId(placeId: number): Promise<number> {
  const data = await fetchJson<{ universeId: number }>(
    `${APIS_API}/universes/v1/places/${placeId}/universe`
  );
  return data.universeId;
}

export async function getGameDetails(universeId: number): Promise<RobloxGameDetails> {
  const data = await fetchJson<GamesListResponse>(
    `${GAMES_API}/v1/games?universeIds=${universeId}`
  );
  const game = data.data[0];
  if (!game) throw new Error(`No game found for universeId ${universeId}`);
  return game;
}

export interface RobloxVotes {
  id: number;
  upVotes: number;
  downVotes: number;
}

export async function getGameVotes(universeId: number): Promise<RobloxVotes> {
  const data = await fetchJson<{ data: RobloxVotes[] }>(
    `${GAMES_API}/v1/games/votes?universeIds=${universeId}`
  );
  const votes = data.data[0];
  if (!votes) throw new Error(`No votes found for universeId ${universeId}`);
  return votes;
}

export async function getGameFavoritesCount(universeId: number): Promise<number> {
  const data = await fetchJson<{ favoritesCount: number }>(
    `${GAMES_API}/v1/games/${universeId}/favorites/count`
  );
  return data.favoritesCount;
}

export interface RobloxGroupInfo {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  owner: { userId: number; username: string } | null;
}

export async function getGroupInfo(groupId: number): Promise<RobloxGroupInfo> {
  return fetchJson<RobloxGroupInfo>(`${GROUPS_API}/v1/groups/${groupId}`);
}

export async function getGameThumbnailUrl(universeId: number): Promise<string | undefined> {
  const data = await fetchJson<{ data: { targetId: number; imageUrl: string }[] }>(
    `${THUMBNAILS_API}/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`
  );
  return data.data[0]?.imageUrl;
}

export async function getGroupIconUrl(groupId: number): Promise<string | undefined> {
  const data = await fetchJson<{ data: { targetId: number; imageUrl: string }[] }>(
    `${THUMBNAILS_API}/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png`
  );
  return data.data[0]?.imageUrl;
}

/**
 * Lädt alle für Hidden Gems relevanten Rohdaten zu einem Spiel in einem
 * Rutsch. Wirft, wenn eine der Teilanfragen fehlschlägt — Aufrufer
 * entscheidet, ob das Spiel dann übersprungen wird.
 */
export async function getGameSnapshot(universeId: number, groupId?: number) {
  const [details, votes, favoritesCount, thumbnailUrl, group] = await Promise.all([
    getGameDetails(universeId),
    getGameVotes(universeId),
    getGameFavoritesCount(universeId),
    getGameThumbnailUrl(universeId),
    groupId ? getGroupInfo(groupId) : Promise.resolve(undefined),
  ]);

  return { details, votes, favoritesCount, thumbnailUrl, group };
}
