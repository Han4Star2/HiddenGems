import { NextRequest, NextResponse } from "next/server";
import { readSessionFromRequest, withSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { gameId } = (await request.json()) as { gameId: string };
  const isSaved = session.savedGameIds.includes(gameId);
  session.savedGameIds = isSaved
    ? session.savedGameIds.filter((id) => id !== gameId)
    : [...session.savedGameIds, gameId];

  return withSessionCookie(NextResponse.json({ saved: !isSaved }), session);
}
