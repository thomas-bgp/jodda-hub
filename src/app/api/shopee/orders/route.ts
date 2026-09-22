import { NextResponse } from "next/server";
import { getValidShopeeToken, shopeeGet } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// get_order_list aceita janela de no máximo 15 dias e 100 por página;
// get_order_detail aceita até 50 order_sn por chamada.
const WINDOW_DAYS = 15;
const DETAIL_BATCH = 50;

export async function GET() {
  const tenant = getSession()?.tenant;
  const token = await getValidShopeeToken(tenant);
  if (!token) return NextResponse.json({ connected: false }, { status: 401 });

  try {
    const now = Math.floor(Date.now() / 1000);
    const list = await shopeeGet(token, "/api/v2/order/get_order_list", {
      time_range_field: "create_time",
      time_from: now - WINDOW_DAYS * 86400,
      time_to: now,
      page_size: 100,
    });
    const sns: string[] = (list.order_list || []).map((o: { order_sn: string }) => o.order_sn);

    const orders = [];
    for (let i = 0; i < sns.length; i += DETAIL_BATCH) {
      const detail = await shopeeGet(token, "/api/v2/order/get_order_detail", {
        order_sn_list: sns.slice(i, i + DETAIL_BATCH).join(","),
        response_optional_fields: "total_amount,item_list,payment_method",
      });
      for (const o of detail.order_list || []) {
        orders.push({
          order_sn: o.order_sn,
          status: o.order_status,
          created_at: new Date(o.create_time * 1000).toISOString(),
          total: Number(o.total_amount || 0),
          currency: o.currency,
          items: (o.item_list || []).reduce(
            (n: number, it: { model_quantity_purchased?: number }) => n + (it.model_quantity_purchased || 0),
            0
          ),
          payment_method: o.payment_method,
        });
      }
    }

    const gmv = orders.reduce((s, o) => s + o.total, 0);
    return NextResponse.json({
      window_days: WINDOW_DAYS,
      total_orders: orders.length,
      gmv,
      avg_ticket: orders.length ? gmv / orders.length : 0,
      orders,
    });
  } catch (error) {
    console.error("Shopee pedidos falhou:", { tenant, shop_id: token.shop_id, error });
    return NextResponse.json({ error: "Não foi possível buscar os pedidos." }, { status: 502 });
  }
}
