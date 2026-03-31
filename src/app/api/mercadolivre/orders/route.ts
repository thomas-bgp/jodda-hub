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

    const ordersData = await mlFetch(
      `https://api.mercadolibre.com/orders/search?seller=${user_id}&sort=date_desc&limit=50`,
      access_token
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
