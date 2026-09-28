import { NextResponse } from "next/server";
import { getValidMagaluToken } from "@/lib/magalu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getValidMagaluToken(getSession()?.tenant);
  if (!token) return NextResponse.json({ connected: false });
  return NextResponse.json({ connected: true, expires_at: token.expires_at, updated_at: token.updated_at });
}
