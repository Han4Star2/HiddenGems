import { NextRequest, NextResponse } from "next/server";

/**
 * Schützt die Ingest-Endpunkte (Submit/Refresh) vor öffentlichem Zugriff —
 * die lösen echte Roblox-API-Aufrufe aus und sollen nicht von x-beliebigen
 * Besuchern oder Bots angestoßen werden können.
 */
export function requireIngestSecret(request: NextRequest): NextResponse | null {
  const configured = process.env.INGEST_SECRET;
  if (!configured) {
    return NextResponse.json(
      { error: "INGEST_SECRET ist serverseitig nicht konfiguriert." },
      { status: 500 }
    );
  }
  const provided = request.headers.get("x-ingest-secret");
  if (provided !== configured) {
    return NextResponse.json({ error: "Ungültiges oder fehlendes Secret." }, { status: 401 });
  }
  return null;
}
