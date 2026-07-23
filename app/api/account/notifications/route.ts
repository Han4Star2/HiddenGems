import { NextRequest, NextResponse } from "next/server";
import { readSessionFromRequest, withSessionCookie } from "@/lib/session";
import { NotificationPreferences } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const patch = (await request.json()) as Partial<NotificationPreferences>;

  if (patch.instant && !session.premium) {
    return NextResponse.json(
      { error: "Sofortige Benachrichtigungen sind ein Premium-Feature." },
      { status: 403 }
    );
  }

  session.notificationPreferences = { ...session.notificationPreferences, ...patch };

  return withSessionCookie(
    NextResponse.json({ notificationPreferences: session.notificationPreferences }),
    session
  );
}
