"use client";

import { useState } from "react";
import { NotificationPreferences as Prefs } from "@/lib/types";
import { useSession } from "./SessionProvider";

export default function NotificationPreferences() {
  const { session, refresh } = useSession();
  const [error, setError] = useState<string | null>(null);

  if (!session) return null;
  const prefs = session.notificationPreferences;

  async function update(patch: Partial<Prefs>) {
    const res = await fetch("/api/account/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Speichern fehlgeschlagen.");
      return;
    }
    setError(null);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
      <label className="flex items-center justify-between">
        <span>Neues Hidden Gem aufgenommen</span>
        <input
          type="checkbox"
          checked={prefs.newHiddenGem}
          onChange={(e) => update({ newHiddenGem: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between">
        <span>Starkes Wachstum</span>
        <input
          type="checkbox"
          checked={prefs.strongGrowth}
          onChange={(e) => update({ strongGrowth: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between">
        <span>Neuer offizieller Discord entdeckt</span>
        <input
          type="checkbox"
          checked={prefs.newDiscordFound}
          onChange={(e) => update({ newDiscordFound: e.target.checked })}
        />
      </label>
      <label className="flex items-center justify-between">
        <span>Score-Schwelle erreicht</span>
        <input
          type="number"
          min={0}
          max={100}
          value={prefs.scoreThreshold ?? ""}
          onChange={(e) =>
            update({ scoreThreshold: e.target.value === "" ? null : Number(e.target.value) })
          }
          className="w-20 rounded border border-border bg-background px-2 py-1"
        />
      </label>
      <label className={`flex items-center justify-between ${!session.premium ? "opacity-50" : ""}`}>
        <span>Sofortige Benachrichtigungen {!session.premium && "(Premium)"}</span>
        <input
          type="checkbox"
          checked={prefs.instant}
          disabled={!session.premium}
          onChange={(e) => update({ instant: e.target.checked })}
        />
      </label>
      {error && <p className="text-rose-400">{error}</p>}
      <p className="text-xs text-foreground/40">
        Hinweis: Der eigentliche Versand (E-Mail/Push) ist in dieser Version noch nicht
        angebunden — hier werden nur Präferenzen gespeichert.
      </p>
    </div>
  );
}
