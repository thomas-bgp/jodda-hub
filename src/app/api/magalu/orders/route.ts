import { NextResponse } from "next/server";
import { getValidMagaluToken, magaluGet, money } from "@/lib/magalu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /seller/v1/orders pagina por _offset/_limit; limite de páginas evita
// travar a tela em lojas muito grandes (o total real vem em meta.page.count).
const WINDOW_DAYS = 30;
const PAGE_SIZE = 50;
const MAX_PAGES = 20;

interface MagaluOrder {
  code: string;
  status: string;
  purchased_at?: string;
  created_at?: string;
  amounts?: { total?: number; normalizer?: number; currency?: string };
  deliveries?: { items?: { quantity?: number }[] }[];
  payments?: { method?: string }[];
}

export async function GET() {
  const tenant = getSession()?.tenant;
  const token = await getValidMagaluToken(tenant);
  if (!token) return NextResponse.json({ connected: false }, { status: 401 });

  try {
    const since = new Date(Date.now() - WINDOW_DAYS * 86400 * 1000).toISOString();
    const raw: MagaluOrder[] = [];
    let total = 0;
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = await magaluGet(token, "/seller/v1/orders", {
        purchased_at__gte: since,
        _sort: "purchased_at:desc",
        _limit: PAGE_SIZE,
        _offset: page * PAGE_SIZE,
      });
      const results: MagaluOrder[] = data.results || [];
      raw.push(...results);
      total = Number(data.meta?.page?.count ?? raw.length);
      if (results.length < PAGE_SIZE || raw.length >= total) break;
    }

    const orders = raw.map((o) => ({
      code: o.code,
      status: o.status,
      created_at: o.purchased_at || o.created_at || "",
      total: money(o.amounts),
      currency: o.amounts?.currency || "BRL",
      items: (o.deliveries || []).reduce(
        (n, d) => n + (d.items || []).reduce((m, it) => m + (it.quantity || 0), 0),
        0
      ),
      payment_method: o.payments?.[0]?.method,
    }));

    // Faturamento ignora pedidos cancelados por inteiro.
    const valid = orders.filter((o) => o.status !== "cancelled");
    const gmv = valid.reduce((s, o) => s + o.total, 0);
    return NextResponse.json({
      window_days: WINDOW_DAYS,
      total_orders: orders.length,
      total_available: total,
      truncated: total > orders.length,
      gmv,
      avg_ticket: valid.length ? gmv / valid.length : 0,
      orders,
    });
  } catch (error) {
    console.error("Magalu pedidos falhou:", { tenant, error });
    return NextResponse.json({ error: "Não foi possível buscar os pedidos." }, { status: 502 });
  }
}
