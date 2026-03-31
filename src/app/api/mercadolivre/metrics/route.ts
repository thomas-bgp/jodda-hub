import { NextResponse } from "next/server";
import { getValidToken } from "@/lib/ml-token";

export const dynamic = "force-dynamic";

async function mlFetch(url: string, accessToken: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`ML API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function GET() {
  try {
    const token = await getValidToken();
    if (!token) {
      return NextResponse.json(
        { error: "Não conectado ao Mercado Livre", connected: false },
        { status: 401 }
      );
    }

    const [ordersData, itemsData] = await Promise.all([
      mlFetch(
        `https://api.mercadolibre.com/orders/search?seller=${token.user_id}&sort=date_desc&limit=50`,
        token.access_token
      ),
      mlFetch(
        `https://api.mercadolibre.com/users/${token.user_id}/items/search?limit=0`,
        token.access_token
      ),
    ]);

    const orders = ordersData.results || [];
    const totalOrders = ordersData.paging?.total || orders.length;

    let totalRevenue = 0;
    for (const order of orders) {
      totalRevenue += order.total_amount || 0;
    }

    const estimatedRevenue =
      totalOrders > orders.length && orders.length > 0
        ? (totalRevenue / orders.length) * totalOrders
        : totalRevenue;

    const ticketMedio = totalOrders > 0 ? estimatedRevenue / totalOrders : 0;
    const totalItems = itemsData.paging?.total || 0;

    return NextResponse.json({
      connected: true,
      faturamento: estimatedRevenue,
      pedidos: totalOrders,
      ticket_medio: ticketMedio,
      produtos: totalItems,
    });
  } catch (error) {
    console.error("ML metrics error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar métricas." },
      { status: 500 }
    );
  }
}
