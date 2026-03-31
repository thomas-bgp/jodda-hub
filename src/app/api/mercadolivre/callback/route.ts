import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Parâmetro 'code' não encontrado." },
      { status: 400 }
    );
  }

  const appId = process.env.ML_APP_ID;
  const appSecret = process.env.ML_APP_SECRET;
  const redirectUri =
    process.env.ML_REDIRECT_URI ||
    "https://appjodda.com/api/mercadolivre/callback";

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "Credenciais ML não configuradas (ML_APP_ID / ML_APP_SECRET)." },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://api.mercadolivre.com.br/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: appId,
          client_secret: appSecret,
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error("ML token exchange failed:", tokenResponse.status, errorBody);
      return NextResponse.json(
        { error: "Falha ao trocar código por token.", details: errorBody },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();

    const tokenInfo = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      user_id: tokenData.user_id,
      expires_at: new Date(
        Date.now() + tokenData.expires_in * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store token in file
    const dataDir = path.join(process.cwd(), "src", "data");
    await mkdir(dataDir, { recursive: true });

    const tokenPath = path.join(dataDir, "ml-token.json");
    await writeFile(tokenPath, JSON.stringify(tokenInfo, null, 2), "utf-8");

    console.log("ML token saved for user_id:", tokenInfo.user_id);

    return NextResponse.redirect(
      new URL("/dashboard/integracoes?ml=connected", request.url)
    );
  } catch (error) {
    console.error("ML callback error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar callback do Mercado Livre." },
      { status: 500 }
    );
  }
}
