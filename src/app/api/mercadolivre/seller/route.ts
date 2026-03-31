import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tokenPath = path.join(process.cwd(), "data", "ml-token.json");
    let token;
    try {
      const raw = await readFile(tokenPath, "utf-8");
      token = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Não conectado ao Mercado Livre", connected: false },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.mercadolibre.com/users/me", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ML seller fetch failed:", response.status, errorBody);
      return NextResponse.json(
        { error: "Falha ao buscar dados do vendedor.", details: errorBody },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      nickname: data.nickname,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      registration_date: data.registration_date,
      seller_reputation: data.seller_reputation,
      address: data.address,
    });
  } catch (error) {
    console.error("ML seller error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar dados do vendedor." },
      { status: 500 }
    );
  }
}
