import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen — Hidden Gems",
};

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 text-sm leading-relaxed text-foreground/80 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Nutzungsbedingungen</h1>
        <p className="text-xs text-foreground/50">Stand: 2026</p>
      </div>

      <p>
        Mit der Nutzung von Hidden Gems (hiddengems123.netlify.app) stimmst du den
        folgenden Bedingungen zu.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">1. Was Hidden Gems ist</h2>
        <p>
          Hidden Gems ist ein Entdeckungs-Verzeichnis für kleine, wachstumsstarke
          Roblox-Spiele mit offiziellem Discord-Server. Wir hosten oder entwickeln keine
          der gelisteten Spiele selbst und stehen in keiner offiziellen Verbindung zu
          Roblox Corporation.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">2. Konto</h2>
        <p>
          Ein Konto erstellst du durch Anmeldung mit deinem Roblox-Account. Du bist
          selbst dafür verantwortlich, dein Roblox-Konto zu sichern. Wir können Konten
          bei Missbrauch der Website sperren.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">3. Premium</h2>
        <p>
          Premium wird nicht direkt bei uns gekauft, sondern durch Besitz eines
          bestimmten Roblox-Gamepasses freigeschaltet. Der Kaufvorgang, Rückerstattungen
          und Zahlungsbedingungen unterliegen ausschließlich den Nutzungsbedingungen von
          Roblox Corporation. Wir garantieren keine bestimmte Verfügbarkeit von
          Premium-Funktionen.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">4. Keine Anlageberatung</h2>
        <p>
          Angezeigte Statistiken, Wachstumszahlen und der &bdquo;Hidden Gem Score&ldquo;
          sind automatisiert berechnete Kennzahlen und stellen keine Anlage-, Investitions-
          oder Geschäftsberatung dar. Entscheidungen auf Basis dieser Daten triffst du auf
          eigenes Risiko.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">5. Haftungsausschluss</h2>
        <p>
          Wir bemühen uns um korrekte Daten, übernehmen aber keine Gewähr für
          Richtigkeit, Vollständigkeit oder Aktualität der angezeigten Informationen.
          Die Nutzung der Website erfolgt auf eigene Verantwortung.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">6. Änderungen</h2>
        <p>
          Wir können diese Bedingungen und die Website jederzeit anpassen. Wesentliche
          Änderungen werden auf dieser Seite veröffentlicht.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">7. Kontakt</h2>
        <p>
          Fragen zu diesen Nutzungsbedingungen? Melde dich über den offiziellen
          Discord-Link auf der Website.
        </p>
      </section>
    </div>
  );
}
