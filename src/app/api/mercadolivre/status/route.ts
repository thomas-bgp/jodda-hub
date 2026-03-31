import { NextResponse } from "next/server";
import { getValidToken } from "@/lib/ml-token";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getValidToken();

  if (token) {
    return NextResponse.json({
      connected: true,
      user_id: token.user_id,
      expires_at: token.expires_at,
    });
  }

  return NextResponse.json({ connected: false });
}
