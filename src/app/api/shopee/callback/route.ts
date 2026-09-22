import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, exchangeCode } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const shopId = Number(params.get("shop_id"));
  const publicClient = params.get("client");
  const client = publicClient ?? getSession()?.tenant ?? "";

  if (!code || !shopId) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/shopee?error=missing_code`);
  }

  try {
    await exchangeCode(client, code, shopId);
    console.info("Shopee token salvo:", { client: client || "(default)", shop_id: shopId });
    const target = publicClient ? "/conectado?mp=shopee" : "/dashboard/shopee?connected=1";
    return NextResponse.redirect(`${BASE_URL}${target}`);
  } catch (error) {
    console.error("Shopee callback falhou:", { client, shop_id: shopId, error });
    return NextResponse.redirect(`${BASE_URL}/dashboard/shopee?error=token`);
  }
}
