"use client";

import { SearchFilters } from "@/lib/filters";

export default function FilterPanel({
  genres,
  filters,
  onChange,
}: {
  genres: string[];
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) {
  function set<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function numberOrUndefined(raw: string): number | undefined {
    if (raw === "") return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
      <div>
        <label className="mb-1 block text-xs text-foreground/60">Genre</label>
        <select
          value={filters.genre ?? ""}
          onChange={(e) => set("genre", e.target.value || undefined)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Max. aktuelle Spieler</label>
        <input
          type="number"
          min={0}
          placeholder="z.B. 1000"
          value={filters.maxPlayers ?? ""}
          onChange={(e) => set("maxPlayers", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Min. Wachstum (7 Tage, %)</label>
        <input
          type="number"
          placeholder="z.B. 20"
          value={filters.minGrowth7d ?? ""}
          onChange={(e) => set("minGrowth7d", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Min. Hidden Gem Score</label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="z.B. 60"
          value={filters.minScore ?? ""}
          onChange={(e) => set("minScore", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Max. Alter (Tage)</label>
        <input
          type="number"
          min={0}
          placeholder="z.B. 30"
          value={filters.maxAgeDays ?? ""}
          onChange={(e) => set("maxAgeDays", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Min. Likes</label>
        <input
          type="number"
          min={0}
          placeholder="z.B. 500"
          value={filters.minLikes ?? ""}
          onChange={(e) => set("minLikes", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-foreground/60">Min. Favorites</label>
        <input
          type="number"
          min={0}
          placeholder="z.B. 500"
          value={filters.minFavorites ?? ""}
          onChange={(e) => set("minFavorites", numberOrUndefined(e.target.value))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({ query: filters.query })}
        className="rounded-lg border border-border px-3 py-2 text-sm text-foreground/70 hover:bg-surface-hover"
      >
        Filter zurücksetzen
      </button>
    </div>
  );
}
