"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { SessionUser } from "@/lib/types";

interface SessionContextValue {
  session: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  toggleSaveGame: (gameId: string) => Promise<void>;
  toggleFollowDeveloper: (developerId: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/account/session");
    const data = (await res.json()) as { session: SessionUser | null };
    setSession(data.session);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleSaveGame = useCallback(
    async (gameId: string) => {
      const res = await postJson("/api/account/save-game", { gameId });
      if (res.status === 401) {
        window.location.href = "/api/auth/roblox/login";
        return;
      }
      await refresh();
    },
    [refresh]
  );

  const toggleFollowDeveloper = useCallback(
    async (developerId: string) => {
      const res = await postJson("/api/account/follow", { developerId });
      if (res.status === 401) {
        window.location.href = "/api/auth/roblox/login";
        return;
      }
      await refresh();
    },
    [refresh]
  );

  return (
    <SessionContext.Provider
      value={{ session, loading, refresh, toggleSaveGame, toggleFollowDeveloper }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession muss innerhalb von SessionProvider verwendet werden");
  return ctx;
}
