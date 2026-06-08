import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import { tokenFilePath, clientSlug } from "@/lib/ml-token";

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
    "https://ecomerce.bertuzzipatrimonial.com.br/api/mercadolivre/callback";

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "Credenciais ML não configuradas (ML_APP_ID / ML_APP_SECRET)." },
      { status: 500 }
    );
  }

  // Multi-tenant: descobre qual cliente está autorizando, via state (OAuth) ou cookie.
  // Sem cliente => arquivo legado ml-token.json (Renalbor), comportamento inalterado.
  const cookieStore = await cookies();
  const stateClient = request.nextUrl.searchParams.get("state") || "";
  const cookieClient = cookieStore.get("ml_client")?.value || "";
  const client = clientSlug(stateClient || cookieClient);

  // Get PKCE code_verifier from cookie
  const codeVerifier = cookieStore.get("ml_code_verifier")?.value;

  if (!codeVerifier) {
    return NextResponse.json(
      { error: "code_verifier não encontrado. Tente conectar novamente." },
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
          grant_type: "authorization_code",
          client_id: appId,
          client_secret: appSecret,
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
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

    // Store token in file (persistent volume at /app/data), por cliente.
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });

    const tokenPath = tokenFilePath(client);
    await writeFile(tokenPath, JSON.stringify(tokenInfo, null, 2), "utf-8");

    console.log(
      "ML token saved for client:",
      client || "(legacy)",
      "user_id:",
      tokenInfo.user_id
    );

    const baseUrl = process.env.ML_REDIRECT_URI
      ? new URL(process.env.ML_REDIRECT_URI).origin
      : "https://ecomerce.bertuzzipatrimonial.com.br";

    const returnTo = cookieStore.get("ml_return_to")?.value;
    cookieStore.delete("ml_return_to");
    cookieStore.delete("ml_code_verifier");
    cookieStore.delete("ml_client");

    const target =
      returnTo && returnTo.startsWith("/")
        ? `${baseUrl}${returnTo}`
        : `${baseUrl}/dashboard/integracoes?ml=connected`;

    return NextResponse.redirect(target);
  } catch (error) {
    console.error("ML callback error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar callback do Mercado Livre." },
      { status: 500 }
    );
  }
}
