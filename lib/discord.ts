import { DiscordInfo, DiscordSource } from "./types";

const INVITE_PATTERN =
  /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/([a-zA-Z0-9-]+)/i;

export function extractDiscordInvite(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const match = text.match(INVITE_PATTERN);
  if (!match) return undefined;
  return `https://discord.gg/${match[1]}`;
}

export interface DiscordDetectionInput {
  gameDescription?: string;
  gameSocialLinks?: string[];
  groupDescription?: string;
}

/**
 * Sucht in Spielbeschreibung, Social Links und Gruppenbeschreibung nach einem
 * offiziellen Discord-Invite, in dieser Priorität. Gibt found: false zurück,
 * wenn nirgends ein Link gefunden wird — solche Spiele werden nicht gelistet.
 */
export function detectOfficialDiscord(input: DiscordDetectionInput): DiscordInfo {
  const sources: { text: string | undefined; source: DiscordSource }[] = [
    { text: input.gameDescription, source: "game" },
    { text: input.gameSocialLinks?.join(" "), source: "game" },
    { text: input.groupDescription, source: "group" },
  ];

  for (const { text, source } of sources) {
    const url = extractDiscordInvite(text);
    if (url) {
      return { found: true, url, source };
    }
  }

  return { found: false };
}
