/**
 * Roblox OAuth 2.0 ("Login with Roblox"), siehe
 * https://create.roblox.com/docs/cloud/reference/oauth2-overview
 *
 * Wie lib/robloxApi.ts ist dieser Client in dieser Sandbox ohne
 * Netzwerkzugriff ungetestet, aber nach der offiziellen Roblox-OAuth2-
 * Dokumentation gebaut. Benötigt ROBLOX_CLIENT_ID / ROBLOX_CLIENT_SECRET aus
 * dem Roblox Creator Dashboard (OAuth-App mit Redirect-URI
 * "<origin>/api/auth/roblox/callback" und Scopes "openid profile").
 */

const AUTHORIZE_URL = "https://apis.roblox.com/oauth/v1/authorize";
const TOKEN_URL = "https://apis.roblox.com/oauth/v1/token";
const USERINFO_URL = "https://apis.roblox.com/oauth/v1/userinfo";

export function getRedirectUri(origin: string): string {
  return `${origin}/api/auth/roblox/callback`;
}

export function buildAuthorizeUrl(origin: string, state: string): string {
  const clientId = process.env.ROBLOX_CLIENT_ID;
  if (!clientId) throw new Error("ROBLOX_CLIENT_ID ist nicht konfiguriert");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(origin),
    scope: "openid profile",
    response_type: "code",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export interface RobloxTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export async function exchangeCodeForToken(
  code: string,
  origin: string
): Promise<RobloxTokenResponse> {
  const clientId = process.env.ROBLOX_CLIENT_ID;
  const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("ROBLOX_CLIENT_ID / ROBLOX_CLIENT_SECRET sind nicht konfiguriert");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(origin),
    }),
  });
  if (!res.ok) {
    throw new Error(`Roblox Token-Austausch fehlgeschlagen: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export interface RobloxUserinfo {
  sub: string; // Roblox User ID als String
  preferred_username: string;
  nickname: string;
  picture?: string;
}

export async function getUserinfo(accessToken: string): Promise<RobloxUserinfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Roblox Userinfo-Abruf fehlgeschlagen: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
