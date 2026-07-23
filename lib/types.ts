export type DiscordSource = "game" | "group";

export interface DiscordInfo {
  found: boolean;
  url?: string;
  source?: DiscordSource;
}

export interface StatPoint {
  date: string; // ISO date
  players: number;
  visits: number;
  favorites: number;
}

export interface Developer {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string;
  memberCount: number;
  description: string;
  discordUrl?: string;
  gameIds: string[];
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  thumbnailUrl: string;
  genre: string;
  description: string;
  createdAt: string; // ISO date
  lastUpdatedAt: string; // ISO date
  developerId: string;
  groupName?: string;
  robloxUrl: string;
  currentPlayers: number;
  visits: number;
  likes: number;
  dislikes: number;
  favorites: number;
  growth24h: number; // percent
  growth7d: number; // percent
  hiddenGemScore: number; // 0-100
  editorsPick: boolean;
  discord: DiscordInfo;
  statHistory: StatPoint[];
}
