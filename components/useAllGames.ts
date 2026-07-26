"use client";

import { useEffect, useState } from "react";
import { games as mockGames } from "@/lib/mockData";
import { Game } from "@/lib/types";

/**
 * Startet mit den Mock-Daten (sofort verfügbar, kein Ladezustand nötig) und
 * ergänzt/ersetzt sie, sobald echte, über /api/games eingelesene Spiele
 * geladen sind. Bei Slug-Kollisionen gewinnt das echte Spiel.
 */
export function useAllGames(): Game[] {
  const [allGames, setAllGames] = useState<Game[]>(mockGames);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/games")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { games: Game[] } | null) => {
        if (cancelled || !data) return;
        const realSlugs = new Set(data.games.map((g) => g.slug));
        setAllGames([...data.games, ...mockGames.filter((g) => !realSlugs.has(g.slug))]);
      })
      .catch(() => {
        // Bei Fehler bleiben die Mock-Daten als Fallback bestehen.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return allGames;
}
