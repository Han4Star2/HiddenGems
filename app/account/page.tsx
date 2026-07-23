import { getSession } from "@/lib/session";
import { games, developers } from "@/lib/mockData";
import { getPremiumGamepassUrl } from "@/lib/premium";
import GameCard from "@/components/GameCard";
import WatchlistManager from "@/components/WatchlistManager";
import NotificationPreferences from "@/components/NotificationPreferences";

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Konto</h1>
        <p className="text-foreground/60">
          Melde dich mit deinem Roblox-Konto an, um Spiele zu speichern, Entwicklern zu folgen
          und Watchlists zu erstellen.
        </p>
        <a
          href="/api/auth/roblox/login"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Mit Roblox anmelden
        </a>
      </div>
    );
  }

  const savedGames = games.filter((g) => session.savedGameIds.includes(g.id));
  const followedDevelopers = developers.filter((d) =>
    session.followedDeveloperIds.includes(d.id)
  );
  const gamepassUrl = getPremiumGamepassUrl();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-4">
        {session.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- unbekannte Roblox-CDN-Domain, next/image erfordert feste remotePatterns
          <img
            src={session.avatarUrl}
            alt={session.displayName}
            className="h-16 w-16 rounded-full border border-border object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{session.displayName}</h1>
          <p className="text-sm text-foreground/50">@{session.username}</p>
        </div>
        {session.premium ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm font-medium text-amber-400">
            ⭐ Premium aktiv
          </span>
        ) : (
          gamepassUrl && (
            <a
              href={gamepassUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              ⭐ Premium-Gamepass auf Roblox kaufen
            </a>
          )
        )}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Gespeicherte Hidden Gems</h2>
        {savedGames.length === 0 ? (
          <p className="text-sm text-foreground/50">Noch keine Spiele gespeichert.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Gefolgte Entwickler</h2>
        {followedDevelopers.length === 0 ? (
          <p className="text-sm text-foreground/50">Noch keinen Entwicklern gefolgt.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {followedDevelopers.map((d) => (
              <a
                key={d.id}
                href={`/developers/${d.slug}`}
                className="rounded-xl border border-border bg-surface p-4 hover:bg-surface-hover"
              >
                <p className="font-medium">{d.name}</p>
                <p className="text-xs text-foreground/50">{d.memberCount} Mitglieder</p>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          Watchlists{" "}
          {!session.premium && (
            <span className="text-sm font-normal text-foreground/40">(kostenlos: 1 Watchlist)</span>
          )}
        </h2>
        <WatchlistManager />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Benachrichtigungen</h2>
        <NotificationPreferences />
      </section>
    </div>
  );
}
