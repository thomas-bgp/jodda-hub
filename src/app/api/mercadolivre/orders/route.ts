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

    const ordersData = await mlFetch(
      `https://api.mercadolibre.com/orders/search?seller=${token.user_id}&sort=date_desc&limit=50`,
      token.access_token
    );

    const orders = ordersData.results || [];
    const total = ordersData.paging?.total || 0;

    return NextResponse.json({ connected: true, orders, total });
  } catch (error) {
    console.error("ML orders error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos." },
      { status: 500 }
    );
  }
}
