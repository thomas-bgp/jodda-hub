import { NextResponse } from "next/server";
import { getValidShopeeToken } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getValidShopeeToken(getSession()?.tenant);
  if (!token) return NextResponse.json({ connected: false });
  return NextResponse.json({ connected: true, shop_id: token.shop_id, expires_at: token.expires_at });
}
