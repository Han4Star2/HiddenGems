"use client";

import { useSession } from "./SessionProvider";

export default function SaveGameButton({ gameId }: { gameId: string }) {
  const { session, toggleSaveGame } = useSession();
  const isSaved = session?.savedGameIds.includes(gameId) ?? false;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaveGame(gameId);
      }}
      title={isSaved ? "Aus gespeicherten Gems entfernen" : "Spiel speichern"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm backdrop-blur transition-colors ${
        isSaved
          ? "border-accent/60 bg-accent/20 text-accent"
          : "border-white/20 bg-black/30 text-white/70 hover:text-white"
      }`}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}
