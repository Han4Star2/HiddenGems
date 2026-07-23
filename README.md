# Hidden Gems

Eine Website, die ausschließlich kleine, wachstumsstarke Roblox-Spiele mit
offiziellem Discord-Server zeigt — kuratiert für Investoren, Publisher und
Entwickler, die Spiele früh entdecken wollen.

Dieser Stand ist ein **Frontend-Grundgerüst mit Mock-Daten**: die Datenanbindung
an die echte Roblox-API, Discord-Erkennung, Nutzerkonten und Benachrichtigungen
sind noch nicht implementiert.

## Getting Started

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Struktur

- `app/` – Seiten (Startseite, Suche, Spielseite, Entwicklerseite)
- `components/` – UI-Komponenten (GameCard, Navbar, Filter, Charts, ...)
- `lib/` – Typen, Mock-Daten, Filter-/Kategorie-/Scoring-Logik

## Nächste Schritte

- Anbindung an die echte Roblox-API (Spieler, Visits, Likes, Favorites)
- Automatische Discord-Erkennung in Spiel-/Gruppenbeschreibung und Social Links
- Echte Hidden-Gem-Score-Berechnung
- Nutzerkonten, Watchlists, Benachrichtigungen, Premium-Features
