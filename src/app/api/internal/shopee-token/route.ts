import { NextRequest, NextResponse } from "next/server";
import { getValidShopeeToken } from "@/lib/shopee";

export const dynamic = "force-dynamic";

// Mesmo contrato de /api/internal/ml-token: header X-Internal-Key + ?client=<slug>.
export async function GET(request: NextRequest) {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) {
    return NextResponse.json({ error: "INTERNAL_API_KEY não configurada no servidor." }, { status: 500 });
  }
  if (request.headers.get("x-internal-key") !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = await getValidShopeeToken(request.nextUrl.searchParams.get("client"));
  if (!token) {
    return NextResponse.json({ error: "Nenhum token salvo. Cliente ainda não autorizou." }, { status: 404 });
  }
  return NextResponse.json({
    access_token: token.access_token,
    shop_id: token.shop_id,
    expires_at: token.expires_at,
    updated_at: token.updated_at,
  });
}
