import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { tokenFilePath, refreshAndStore } from "@/lib/ml-token";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const appId = process.env.ML_APP_ID;
  const appSecret = process.env.ML_APP_SECRET;

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "Credenciais ML não configuradas." },
      { status: 500 }
    );
  }

  // Multi-tenant: ?client=<slug>. Sem o parâmetro = token legado (Renalbor).
  const client = request.nextUrl.searchParams.get("client");

  let currentToken;
  try {
    const raw = await readFile(tokenFilePath(client), "utf-8");
    currentToken = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Nenhum token encontrado. Faça a autenticação primeiro." },
      { status: 404 }
    );
  }

  if (!currentToken.refresh_token) {
    return NextResponse.json({ error: "Refresh token ausente." }, { status: 400 });
  }

  const updated = await refreshAndStore(currentToken, client);
  if (!updated) {
    return NextResponse.json({ error: "Falha ao renovar token." }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    user_id: updated.user_id,
    expires_at: updated.expires_at,
  });
}
