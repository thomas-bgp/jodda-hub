import { NextResponse } from "next/server";
import { getValidShopeeToken, shopeeGet } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const tenant = getSession()?.tenant;
  const token = await getValidShopeeToken(tenant);
  if (!token) return NextResponse.json({ connected: false }, { status: 401 });
  try {
    const info = await shopeeGet(token, "/api/v2/shop/get_shop_info");
    return NextResponse.json({
      connected: true,
      shop_id: token.shop_id,
      shop_name: info.shop_name,
      region: info.region,
      status: info.status,
      expire_time: info.expire_time,
    });
  } catch (error) {
    console.error("Shopee get_shop_info falhou:", { tenant, shop_id: token.shop_id, error });
    return NextResponse.json({ error: "Não foi possível consultar a loja." }, { status: 502 });
  }
}
