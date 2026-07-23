import { NextRequest, NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/session";

export async function GET(request: NextRequest) {
  return NextResponse.json({ session: readSessionFromRequest(request) });
}
