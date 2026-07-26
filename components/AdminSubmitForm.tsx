"use client";

import { useState } from "react";

function extractId(input: string, pathSegment: "games" | "groups"): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  const match = trimmed.match(new RegExp(`${pathSegment}\\/(\\d+)`, "i"));
  return match ? Number(match[1]) : null;
}

export default function AdminSubmitForm() {
  const [secret, setSecret] = useState("");
  const [gameInput, setGameInput] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [genre, setGenre] = useState("");
  const [editorsPick, setEditorsPick] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const placeId = extractId(gameInput, "games");
    if (!placeId) {
      setResult({ type: "error", message: "Ungültige Roblox-Spiel-URL oder Place-ID." });
      return;
    }
    const groupId = extractId(groupInput, "groups") ?? undefined;

    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ingest-secret": secret },
        body: JSON.stringify({ placeId, groupId, genre: genre || undefined, editorsPick }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error ?? "Unbekannter Fehler." });
      } else {
        setResult({
          type: "success",
          message: `"${data.game.name}" importiert — Score ${data.game.hiddenGemScore}, Discord: ${data.game.discord.url}`,
        });
        setGameInput("");
        setGroupInput("");
      }
    } catch {
      setResult({ type: "error", message: "Anfrage fehlgeschlagen." });
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/games/refresh", {
        method: "POST",
        headers: { "x-ingest-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error ?? "Unbekannter Fehler." });
      } else {
        const summary = (data.results as { slug: string; status: string }[])
          .map((r) => `${r.slug}: ${r.status}`)
          .join(", ");
        setResult({
          type: "success",
          message: `Refresh abgeschlossen — ${summary || "keine echten Spiele gespeichert"}`,
        });
      }
    } catch {
      setResult({ type: "error", message: "Anfrage fehlgeschlagen." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold">Spiel einlesen (Admin)</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Liest ein echtes Roblox-Spiel live ein. Ohne offiziellen Discord in Spiel- oder
          Gruppenbeschreibung wird es abgelehnt.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4"
      >
        <div>
          <label className="mb-1 block text-xs text-foreground/60">Ingest Secret</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/60">
            Roblox-Spiel-URL oder Place-ID
          </label>
          <input
            value={gameInput}
            onChange={(e) => setGameInput(e.target.value)}
            placeholder="https://www.roblox.com/games/1234567/Mein-Spiel"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/60">
            Gruppen-URL oder Gruppen-ID (optional)
          </label>
          <input
            value={groupInput}
            onChange={(e) => setGroupInput(e.target.value)}
            placeholder="https://www.roblox.com/groups/1234567/Meine-Gruppe"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/60">Genre (optional)</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="z.B. Survival"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={editorsPick}
            onChange={(e) => setEditorsPick(e.target.checked)}
          />
          Editor&apos;s Pick
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Läuft…" : "Einlesen"}
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={busy}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover disabled:opacity-50"
          >
            Alle echten Spiele aktualisieren
          </button>
        </div>
      </form>

      {result && (
        <p className={`text-sm ${result.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
