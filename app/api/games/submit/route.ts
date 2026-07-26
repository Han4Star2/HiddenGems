import { NextRequest, NextResponse } from "next/server";
import { requireIngestSecret } from "@/lib/ingestAuth";
import { ingestDeveloperFromGroup, ingestGameFromRoblox, NoOfficialDiscordError } from "@/lib/discovery";
import { saveGame } from "@/lib/gameStore";
import { getDeveloper, saveDeveloper } from "@/lib/developerStore";

interface SubmitBody {
  placeId: number;
  groupId?: number;
  genre?: string;
  editorsPick?: boolean;
}

export async function POST(request: NextRequest) {
  const authError = requireIngestSecret(request);
  if (authError) return authError;

  const body = (await request.json()) as SubmitBody;
  if (!body.placeId) {
    return NextResponse.json({ error: "placeId ist erforderlich." }, { status: 400 });
  }

  try {
    const game = await ingestGameFromRoblox(body);

    if (body.groupId) {
      const existingDeveloper = await getDeveloper(String(body.groupId));
      const developer = await ingestDeveloperFromGroup(body.groupId, existingDeveloper ?? undefined);
      if (!developer.gameIds.includes(game.id)) {
        developer.gameIds = [...developer.gameIds, game.id];
      }
      await saveDeveloper(developer);
    }

    await saveGame(game);
    return NextResponse.json({ game });
  } catch (err) {
    if (err instanceof NoOfficialDiscordError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Game ingest failed", err);
    return NextResponse.json({ error: "Import von Roblox fehlgeschlagen." }, { status: 502 });
  }
}
