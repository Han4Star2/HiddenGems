import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readSessionFromRequest, withSessionCookie } from "@/lib/session";

const FREE_WATCHLIST_LIMIT = 1;

type WatchlistAction =
  | { action: "create"; name: string }
  | { action: "delete"; watchlistId: string }
  | { action: "toggleGame"; watchlistId: string; gameId: string };

export async function POST(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const body = (await request.json()) as WatchlistAction;

  if (body.action === "create") {
    if (!session.premium && session.watchlists.length >= FREE_WATCHLIST_LIMIT) {
      return NextResponse.json(
        {
          error: `Kostenlose Konten sind auf ${FREE_WATCHLIST_LIMIT} Watchlist begrenzt. Premium schaltet unbegrenzte Watchlists frei.`,
        },
        { status: 403 }
      );
    }
    session.watchlists.push({ id: randomUUID(), name: body.name, gameIds: [] });
  } else if (body.action === "delete") {
    session.watchlists = session.watchlists.filter((w) => w.id !== body.watchlistId);
  } else if (body.action === "toggleGame") {
    const list = session.watchlists.find((w) => w.id === body.watchlistId);
    if (list) {
      const has = list.gameIds.includes(body.gameId);
      list.gameIds = has
        ? list.gameIds.filter((id) => id !== body.gameId)
        : [...list.gameIds, body.gameId];
    }
  } else {
    return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
  }

  return withSessionCookie(NextResponse.json({ watchlists: session.watchlists }), session);
}
