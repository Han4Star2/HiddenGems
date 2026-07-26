# Hidden Gems

Eine Website, die ausschließlich kleine, wachstumsstarke Roblox-Spiele mit
offiziellem Discord-Server zeigt — kuratiert für Investoren, Publisher und
Entwickler, die Spiele früh entdecken wollen.

Die **Startseite/Suche/Spielseite/Entwicklerseite zeigen aktuell noch
Mock-Daten** — das Backend, das echte Roblox-Spiele einliest, läuft parallel
dazu und ist bereit, angebunden zu werden (siehe „Echte Spiele einlesen"
unten). Login, Sessions, Watchlists und die Premium-Freischaltung sind
**echte, lauffähige Funktionalität** — sie brauchen nur die unten
beschriebenen Umgebungsvariablen.

## Getting Started

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Struktur

- `app/` – Seiten (Startseite, Suche, Spielseite, Entwicklerseite, Konto) und
  API-Routen unter `app/api/`
- `components/` – UI-Komponenten (GameCard, Navbar, Filter, Charts, Account-UI)
- `lib/` – Typen, Mock-Daten, Filter-/Kategorie-/Scoring-Logik, Roblox-Clients,
  Session-Handling

## Login & Premium

Anmeldung läuft über **"Login with Roblox"** (Roblox OAuth 2.0). Es gibt keine
eigene Datenbank — die Session (Profil, gespeicherte Spiele, gefolgte
Entwickler, Watchlists, Benachrichtigungseinstellungen) wird komplett in einem
signierten, httpOnly-Cookie gespeichert (`lib/session.ts`). Das reicht für
eine Einzelgerät-Nutzung; für geräteübergreifende Konten wäre als nächstes
eine echte Datenbank der richtige Schritt.

**Premium wird nicht mit Echtgeld auf der Website verkauft.** Stattdessen
kauft man auf Roblox selbst einen Gamepass (oder ein T-Shirt) — die Website
prüft nach dem Login nur, ob der eingeloggte Roblox-Account dieses Item
besitzt (`lib/premium.ts`, über die öffentliche Roblox Inventory API). Damit
bleibt der komplette Zahlungsprozess bei Roblox, inklusive deren üblichem
Marketplace-Anteil.

### Benötigte Umgebungsvariablen

| Variable | Zweck |
| --- | --- |
| `SESSION_SECRET` | Signiert die Session-Cookie (HMAC). Ohne gesetzten Wert läuft ein unsicherer Dev-Default, mit Warnung im Log. |
| `ROBLOX_CLIENT_ID` / `ROBLOX_CLIENT_SECRET` | OAuth-App aus dem [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials), Redirect-URI `<origin>/api/auth/roblox/callback`, Scopes `openid profile`. |
| `PREMIUM_GAMEPASS_ID` | ID des Gamepasses, dessen Besitz Premium freischaltet. |
| `PREMIUM_TSHIRT_ID` | Optional: zusätzliches T-Shirt/Asset, dessen Besitz ebenfalls Premium freischaltet. |

Ohne `ROBLOX_CLIENT_ID` zeigt der Login-Button einen Fehler statt echter
Weiterleitung — alles andere (UI, Mock-Daten, Build) funktioniert trotzdem.

## Echte Spiele einlesen

Roblox bietet keine "alle Spiele"-API, nach der automatisch gecrawlt werden
könnte — Spiele werden deshalb einzeln per Roblox-Place-ID eingelesen
(manuell oder über eine eigene Kandidaten-Recherche). Die Ingestion-Pipeline
(`lib/discovery.ts`) lädt dazu live von Roblox: Spieler-/Visit-/Like-/
Favorite-Zahlen, Erstellungs-/Update-Datum sowie die Spiel- und
Gruppenbeschreibung. Wird darin **kein offizieller Discord-Link** gefunden,
wird das Spiel nicht gespeichert (Kernkriterium der Website).

Gespeichert wird ohne eigene Datenbank über **Netlify Blobs**
(`lib/blobStore.ts`, `@netlify/blobs`) — funktioniert automatisch, sobald auf
Netlify deployed. Lokal (`next dev`/`next build` ohne Netlify-Kontext) fällt
der Store auf eine JSON-Datei unter `.data/` zurück.

API-Endpunkte (geschützt durch den Header `x-ingest-secret: <INGEST_SECRET>`):

- `POST /api/games/submit` — `{ placeId, groupId?, genre?, editorsPick? }`,
  liest ein neues Spiel (und optional dessen Gruppe) ein
- `POST /api/games/refresh` — aktualisiert alle gespeicherten echten Spiele
  mit frischen Roblox-Werten und schreibt einen neuen Verlaufspunkt fort;
  Spiele ohne Discord mehr werden automatisch entfernt. Für den täglichen
  Aufruf gedacht, z.B. über einen GitHub-Actions-Scheduled-Workflow

Öffentlich lesbar (kein Secret nötig):

- `GET /api/games` — alle echt eingelesenen Spiele
- `GET /api/games/[slug]` — ein einzelnes Spiel

Diese Endpunkte sind in dieser Entwicklungsumgebung ohne Netzwerkzugriff auf
Roblox ungetestet gegen echte Daten — Auth, Speicherung, Fehlerpfade
(fehlender Discord, fehlende `placeId`, Netzwerkfehler) wurden aber
end-to-end mit einem lokalen Mock-Eintrag verifiziert.

## Nächste Schritte

- `/api/games` an die Frontend-Seiten anbinden (Startseite/Suche/Spielseite
  laufen aktuell noch komplett auf `lib/mockData.ts`)
- Kandidaten-Recherche für neue Hidden Gems systematisieren (aktuell manuell
  per Place-ID über `/api/games/submit`)
- Datenbank statt Cookie-Session, sobald geräteübergreifende Konten oder
  Server-seitige Benachrichtigungs-Jobs gebraucht werden
- Tatsächlicher Versand von Benachrichtigungen (E-Mail/Push) — aktuell werden
  nur Präferenzen gespeichert
- Erweiterte Diagramme, Datenexport, API-Zugriff als weitere Premium-Perks
