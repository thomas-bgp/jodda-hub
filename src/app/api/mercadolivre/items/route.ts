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

    // Get item IDs
    const searchData = await mlFetch(
      `https://api.mercadolibre.com/users/${user_id}/items/search?limit=50`,
      access_token
    );

    const itemIds: string[] = searchData.results || [];
    const totalItems = searchData.paging?.total || 0;

    if (itemIds.length === 0) {
      return NextResponse.json({ connected: true, items: [], total: 0 });
    }

    // Fetch item details in batches of 20 (ML multiget limit)
    const items: any[] = [];
    for (let i = 0; i < itemIds.length; i += 20) {
      const batch = itemIds.slice(i, i + 20);
      const multiget = await mlFetch(
        `https://api.mercadolibre.com/items?ids=${batch.join(",")}&attributes=id,title,price,thumbnail,sold_quantity,available_quantity,status,currency_id`,
        access_token
      );
      for (const entry of multiget) {
        if (entry.code === 200 && entry.body) {
          items.push(entry.body);
        }
      }
    }

    return NextResponse.json({ connected: true, items, total: totalItems });
  } catch (error) {
    console.error("ML items error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos." },
      { status: 500 }
    );
  }
}
