import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST() {
  const appId = process.env.ML_APP_ID;
  const appSecret = process.env.ML_APP_SECRET;

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "Credenciais ML não configuradas." },
      { status: 500 }
    );
  }

  const tokenPath = path.join(process.cwd(), "data", "ml-token.json");

  let currentToken;
  try {
    const raw = await readFile(tokenPath, "utf-8");
    currentToken = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Nenhum token encontrado. Faça a autenticação primeiro." },
      { status: 404 }
    );
  }

  if (!currentToken.refresh_token) {
    return NextResponse.json(
      { error: "Refresh token ausente." },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "refresh_token",
          client_id: appId,
          client_secret: appSecret,
          refresh_token: currentToken.refresh_token,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error("ML token refresh failed:", tokenResponse.status, errorBody);
      return NextResponse.json(
        { error: "Falha ao renovar token.", details: errorBody },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();

    const updatedToken = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      user_id: tokenData.user_id,
      expires_at: new Date(
        Date.now() + tokenData.expires_in * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    };

    await writeFile(tokenPath, JSON.stringify(updatedToken, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      user_id: updatedToken.user_id,
      expires_at: updatedToken.expires_at,
    });
  } catch (error) {
    console.error("ML refresh error:", error);
    return NextResponse.json(
      { error: "Erro interno ao renovar token." },
      { status: 500 }
    );
  }
}
