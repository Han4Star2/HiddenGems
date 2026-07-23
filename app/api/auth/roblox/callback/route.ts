import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserinfo } from "@/lib/robloxOAuth";
import { checkPremiumStatus } from "@/lib/premium";
import { OAUTH_STATE_COOKIE, withSessionCookie } from "@/lib/session";
import { SessionUser } from "@/lib/types";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?authError=invalid_state", request.url));
  }

  try {
    const token = await exchangeCodeForToken(code, request.nextUrl.origin);
    const userinfo = await getUserinfo(token.access_token);
    const robloxUserId = Number(userinfo.sub);
    const premium = await checkPremiumStatus(robloxUserId);

    const session: SessionUser = {
      robloxUserId,
      username: userinfo.preferred_username,
      displayName: userinfo.nickname,
      avatarUrl: userinfo.picture,
      premium,
      savedGameIds: [],
      followedDeveloperIds: [],
      watchlists: [],
      notificationPreferences: {
        newHiddenGem: true,
        strongGrowth: true,
        newDiscordFound: false,
        scoreThreshold: null,
        instant: false,
      },
    };

    const response = NextResponse.redirect(new URL("/account", request.url));
    response.cookies.delete(OAUTH_STATE_COOKIE);
    return withSessionCookie(response, session);
  } catch (err) {
    console.error("Roblox OAuth callback failed", err);
    return NextResponse.redirect(new URL("/?authError=oauth_failed", request.url));
  }
}
