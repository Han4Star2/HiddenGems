import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/robloxOAuth";
import { cookieOptions, OAUTH_STATE_COOKIE } from "@/lib/session";

export async function GET(request: NextRequest) {
  if (!process.env.ROBLOX_CLIENT_ID) {
    return NextResponse.redirect(
      new URL("/?authError=roblox_oauth_not_configured", request.url)
    );
  }

  const state = randomBytes(16).toString("hex");
  const response = NextResponse.redirect(buildAuthorizeUrl(request.nextUrl.origin, state));
  response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions(600));
  return response;
}
