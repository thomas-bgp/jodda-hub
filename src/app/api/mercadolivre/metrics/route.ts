import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function getToken() {
  const tokenPath = path.join(process.cwd(), "data", "ml-token.json");
  const raw = await readFile(tokenPath, "utf-8");
  return JSON.parse(raw);
}

async function mlFetch(url: string, accessToken: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`ML API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function GET() {
  try {
    let token;
    try {
      token = await getToken();
    } catch {
      return NextResponse.json(
        { error: "Nao conectado ao Mercado Livre", connected: false },
        { status: 401 }
      );
    }

    const { access_token, user_id } = token;

    // Fetch orders to calculate metrics
    const ordersData = await mlFetch(
      `https://api.mercadolibre.com/orders/search?seller=${user_id}&sort=date_desc&limit=50`,
      access_token
    );

    const orders = ordersData.results || [];
    const totalOrders = ordersData.paging?.total || orders.length;

    let totalRevenue = 0;
    for (const order of orders) {
      totalRevenue += order.total_amount || 0;
    }

    // Estimate total revenue based on paging
    const estimatedRevenue =
      totalOrders > orders.length && orders.length > 0
        ? (totalRevenue / orders.length) * totalOrders
        : totalRevenue;

    const ticketMedio =
      totalOrders > 0 ? estimatedRevenue / totalOrders : 0;

    // Fetch items count
    const itemsData = await mlFetch(
      `https://api.mercadolibre.com/users/${user_id}/items/search?limit=0`,
      access_token
    );
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
      { error: "Erro ao buscar metricas." },
      { status: 500 }
    );
  }
}
