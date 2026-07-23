import { createHmac } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { SessionUser } from "./types";

export const SESSION_COOKIE = "hg_session";
export const OAUTH_STATE_COOKIE = "hg_oauth_state";

const SECRET = process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me";

if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
  console.warn("SESSION_SECRET ist nicht gesetzt — Sessions sind in Produktion unsicher.");
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as SessionUser;
  } catch {
    return null;
  }
}

/** Nur in Server Components verwendbar (liest über next/headers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

/** In Route Handlern verwendbar, liest synchron von der Request. */
export function readSessionFromRequest(request: NextRequest): SessionUser | null {
  return decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
}

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: maxAgeSeconds,
    path: "/",
  };
}

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function withSessionCookie(response: NextResponse, session: SessionUser): NextResponse {
  response.cookies.set(SESSION_COOKIE, encodeSession(session), cookieOptions(THIRTY_DAYS));
  return response;
}
