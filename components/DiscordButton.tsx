"use client";

import { DiscordInfo } from "@/lib/types";

export default function DiscordButton({
  discord,
  showSource = false,
}: {
  discord: DiscordInfo;
  showSource?: boolean;
}) {
  if (!discord.found || !discord.url) return null;

  return (
    <a
      href={discord.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#5865F2]/15 px-3 py-1.5 text-xs font-medium text-[#a6b0ff] transition-colors hover:bg-[#5865F2]/25"
    >
      <span aria-hidden>🎮</span>
      <span>Discord</span>
      {showSource && discord.source && (
        <span className="text-[#a6b0ff]/60">
          · via {discord.source === "game" ? "Spiel" : "Gruppe"}
        </span>
      )}
    </a>
  );
}
