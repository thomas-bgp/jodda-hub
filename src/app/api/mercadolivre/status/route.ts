import { NextResponse } from "next/server";
import { getValidToken } from "@/lib/ml-token";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getValidToken(getSession()?.tenant);

  if (token) {
    return NextResponse.json({
      connected: true,
      user_id: token.user_id,
      expires_at: token.expires_at,
    });
  }

  return NextResponse.json({ connected: false });
}
