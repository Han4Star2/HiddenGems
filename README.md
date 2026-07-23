# Hidden Gems

Eine Website, die ausschließlich kleine, wachstumsstarke Roblox-Spiele mit
offiziellem Discord-Server zeigt — kuratiert für Investoren, Publisher und
Entwickler, die Spiele früh entdecken wollen.

Spiel-, Wachstums- und Score-Daten sind aktuell **Mock-Daten** (die echte
Roblox-Anbindung ist als fertiger Client in `lib/robloxApi.ts` vorbereitet,
aber in dieser Entwicklungsumgebung ohne Netzwerkzugriff ungetestet). Login,
Sessions, Watchlists und die Premium-Freischaltung sind dagegen **echte,
lauffähige Funktionalität** — sie brauchen nur die unten beschriebenen
Umgebungsvariablen.

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

## Nächste Schritte

- Anbindung an die echte Roblox-API produktiv schalten (`lib/robloxApi.ts` ist
  bereits fertig, aber gegen echten Netzwerkzugriff ungetestet)
- Discovery-Prozess, der neue kleine Roblox-Spiele überhaupt erst findet
  (Roblox bietet keine "alle Spiele"-API — braucht Crawling/Charts-Quelle)
- Datenbank statt Cookie-Session, sobald geräteübergreifende Konten oder
  Server-seitige Benachrichtigungs-Jobs gebraucht werden
- Tatsächlicher Versand von Benachrichtigungen (E-Mail/Push) — aktuell werden
  nur Präferenzen gespeichert
- Erweiterte Diagramme, Datenexport, API-Zugriff als weitere Premium-Perks
