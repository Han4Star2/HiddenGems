import { NextRequest, NextResponse } from "next/server";
import { requireIngestSecret } from "@/lib/ingestAuth";
import { listGames, removeGame, saveGame } from "@/lib/gameStore";
import { ingestGameFromRoblox, NoOfficialDiscordError } from "@/lib/discovery";

/**
 * Aktualisiert alle gespeicherten echten Spiele (nicht die Mock-Daten) mit
 * frischen Roblox-Werten und schreibt einen neuen Verlaufspunkt fort. Ein
 * Spiel, das seinen offiziellen Discord verloren hat, wird dabei automatisch
 * wieder entfernt (Kernkriterium aus AGENTS.md). Gedacht zum täglichen
 * Aufruf über einen externen Cron (z.B. GitHub Actions Scheduled Workflow)
 * mit dem x-ingest-secret Header.
 */
export async function POST(request: NextRequest) {
  const authError = requireIngestSecret(request);
  if (authError) return authError;

  const games = await listGames();
  const results: { slug: string; status: "updated" | "removed" | "failed"; error?: string }[] = [];

  for (const game of games) {
    if (!game.robloxPlaceId) {
      results.push({ slug: game.slug, status: "failed", error: "robloxPlaceId fehlt" });
      continue;
    }
    try {
      const groupId = game.robloxCreatorType === "Group" ? Number(game.developerId) : undefined;
      const updated = await ingestGameFromRoblox(
        { placeId: game.robloxPlaceId, groupId, genre: game.genre, editorsPick: game.editorsPick },
        game
      );
      await saveGame(updated);
      results.push({ slug: game.slug, status: "updated" });
    } catch (err) {
      if (err instanceof NoOfficialDiscordError) {
        await removeGame(game.slug);
        results.push({ slug: game.slug, status: "removed", error: err.message });
        continue;
      }
      results.push({ slug: game.slug, status: "failed", error: String(err) });
    }
  }

  return NextResponse.json({ results });
}
