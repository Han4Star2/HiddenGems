"use client";

import { useMemo, useState } from "react";
import { useAllGames } from "@/components/useAllGames";
import { allGenres, searchGames, SearchFilters } from "@/lib/filters";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import GameCard from "@/components/GameCard";

export default function SearchPage() {
  const games = useAllGames();
  const [filters, setFilters] = useState<SearchFilters>({});
  const genres = useMemo(() => allGenres(games), [games]);
  const results = useMemo(() => searchGames(games, filters), [games, filters]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Hidden Gems durchsuchen</h1>
        <p className="text-sm text-foreground/60">
          Nur Spiele mit erfülltem Hidden-Gem-Kriterium und offiziellem Discord werden
          angezeigt.
        </p>
      </div>

      <SearchBar
        value={filters.query ?? ""}
        onChange={(query) => setFilters((f) => ({ ...f, query: query || undefined }))}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <FilterPanel genres={genres} filters={filters} onChange={setFilters} />

        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground/50">
            {results.length} {results.length === 1 ? "Spiel" : "Spiele"} gefunden
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((game) => (
              <div key={game.id} className="w-full">
                <GameCard game={game} />
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-foreground/50">
              Keine Hidden Gems gefunden. Versuche andere Filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
