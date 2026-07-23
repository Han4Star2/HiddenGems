import { NextRequest, NextResponse } from "next/server";
import { readSessionFromRequest, withSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { developerId } = (await request.json()) as { developerId: string };
  const isFollowed = session.followedDeveloperIds.includes(developerId);
  session.followedDeveloperIds = isFollowed
    ? session.followedDeveloperIds.filter((id) => id !== developerId)
    : [...session.followedDeveloperIds, developerId];

  return withSessionCookie(NextResponse.json({ followed: !isFollowed }), session);
}
