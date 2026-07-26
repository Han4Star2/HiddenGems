"use client";

import { useState } from "react";
import { useAllGames } from "./useAllGames";
import { useSession } from "./SessionProvider";

export default function WatchlistManager() {
  const { session, refresh } = useSession();
  const games = useAllGames();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!session) return null;

  async function postAction(body: Record<string, unknown>) {
    const res = await fetch("/api/account/watchlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Etwas ist schiefgelaufen.");
      return;
    }
    setError(null);
    await refresh();
  }

  async function createWatchlist() {
    if (!newName.trim()) return;
    await postAction({ action: "create", name: newName.trim() });
    setNewName("");
  }

  const savedGames = games.filter((g) => session.savedGameIds.includes(g.id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='Neue Watchlist (z.B. "Q3 Kandidaten")'
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent/60"
        />
        <button
          type="button"
          onClick={createWatchlist}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Erstellen
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}

      {session.watchlists.length === 0 && (
        <p className="text-sm text-foreground/50">Noch keine Watchlists erstellt.</p>
      )}

      {session.watchlists.map((list) => (
        <div key={list.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">{list.name}</h3>
            <button
              type="button"
              onClick={() => postAction({ action: "delete", watchlistId: list.id })}
              className="text-xs text-rose-400 hover:underline"
            >
              Löschen
            </button>
          </div>
          {savedGames.length === 0 ? (
            <p className="text-xs text-foreground/50">
              Speichere zuerst Spiele (☆-Button), um sie hier hinzuzufügen.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {savedGames.map((g) => (
                <label key={g.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={list.gameIds.includes(g.id)}
                    onChange={() =>
                      postAction({ action: "toggleGame", watchlistId: list.id, gameId: g.id })
                    }
                  />
                  {g.name}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
