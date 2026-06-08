import { NextRequest, NextResponse } from "next/server";
import { getValidToken } from "@/lib/ml-token";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "INTERNAL_API_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  const provided =
    request.headers.get("x-internal-key") ||
    request.headers.get("X-Internal-Key");

  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Multi-tenant: ?client=<slug> lê o token daquele cliente.
  // Sem o parâmetro = token legado (Renalbor), mantendo compat com consumidores antigos.
  const client = request.nextUrl.searchParams.get("client");

  const token = await getValidToken(client);
  if (!token) {
    return NextResponse.json(
      { error: "Nenhum token salvo. Cliente ainda não autorizou." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    access_token: token.access_token,
    user_id: token.user_id,
    expires_at: token.expires_at,
    updated_at: token.updated_at,
  });
}
