import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Hidden Gems",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 text-sm leading-relaxed text-foreground/80 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Datenschutzerklärung</h1>
        <p className="text-xs text-foreground/50">Stand: 2026</p>
      </div>

      <p>
        Diese Datenschutzerklärung erklärt, welche Daten Hidden Gems
        (&bdquo;wir&ldquo;, erreichbar unter hiddengems123.netlify.app) erhebt, wenn du die
        Website nutzt, und wofür sie verwendet werden.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">1. Anmeldung mit Roblox</h2>
        <p>
          Die Anmeldung erfolgt ausschließlich über &bdquo;Login with Roblox&ldquo;
          (Roblox OAuth 2.0). Dabei erhalten wir von Roblox: deine Roblox-Nutzer-ID,
          deinen Benutzernamen, deinen Anzeigenamen und dein Profilbild. Wir erhalten
          niemals dein Roblox-Passwort — die Anmeldung läuft vollständig über Roblox.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">2. Speicherung deiner Kontodaten</h2>
        <p>
          Wir betreiben keine eigene Datenbank für Nutzerkonten. Stattdessen werden dein
          Profil, gespeicherte Spiele, gefolgte Entwickler, Watchlists und
          Benachrichtigungseinstellungen verschlüsselt signiert in einem einzigen,
          browserseitigen Cookie gespeichert (nur für diesen Zweck, nicht auslesbar oder
          veränderbar durch Dritte). Dieses Cookie ist an dein Gerät gebunden und wird
          nach 30 Tagen automatisch ungültig, spätestens aber beim Logout gelöscht.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">3. Premium-Status</h2>
        <p>
          Um zu prüfen, ob du Premium freigeschaltet hast, fragen wir bei Roblox ab, ob
          dein Account einen bestimmten Gamepass besitzt. Der Kauf selbst findet
          vollständig auf Roblox statt — wir verarbeiten oder speichern keine
          Zahlungsdaten.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">4. Spieldaten</h2>
        <p>
          Statistiken zu gezeigten Roblox-Spielen (Spielerzahlen, Wachstum, Likes,
          Favorites usw.) stammen aus öffentlich zugänglichen Roblox-Daten und betreffen
          keine personenbezogenen Daten von Nutzer:innen dieser Spiele.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">5. Weitergabe an Dritte</h2>
        <p>
          Wir verkaufen oder teilen deine Daten nicht mit Dritten. Anfragen zur
          Premium-Prüfung gehen ausschließlich an die öffentliche Roblox-API.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">6. Deine Rechte</h2>
        <p>
          Da alle Kontodaten in deinem eigenen Cookie liegen, kannst du sie jederzeit
          selbst löschen, indem du dich ausloggst oder die Cookies deines Browsers für
          diese Seite entfernst.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">7. Kontakt</h2>
        <p>
          Fragen zu dieser Datenschutzerklärung? Melde dich über den offiziellen
          Discord-Link auf der Website.
        </p>
      </section>
    </div>
  );
}
