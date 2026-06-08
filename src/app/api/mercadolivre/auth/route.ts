import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const appId = process.env.ML_APP_ID;
  const redirectUri =
    process.env.ML_REDIRECT_URI ||
    "https://ecomerce.bertuzzipatrimonial.com.br/api/mercadolivre/callback";

  if (!appId) {
    return NextResponse.json(
      { error: "ML_APP_ID não configurado nas variáveis de ambiente." },
      { status: 500 }
    );
  }

  const codeVerifier = randomBytes(32)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 128);

  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Allow flow to specify post-auth landing page (e.g. public /conectado)
  const returnTo = request.nextUrl.searchParams.get("return") || "";

  // Multi-tenant: identifica qual cliente está autorizando. Vai no `state`
  // (round-trip garantido pelo OAuth) e também num cookie de fallback.
  const client = (request.nextUrl.searchParams.get("client") || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 40);

  const cookieStore = await cookies();
  cookieStore.set("ml_code_verifier", codeVerifier, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",
  });

  if (client) {
    cookieStore.set("ml_client", client, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
      sameSite: "lax",
    });
  }

  if (returnTo.startsWith("/")) {
    cookieStore.set("ml_return_to", returnTo, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
      sameSite: "lax",
    });
  }

  const authUrl =
    `https://auth.mercadolivre.com.br/authorization` +
    `?response_type=code` +
    `&client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    (client ? `&state=${encodeURIComponent(client)}` : "");

  return NextResponse.redirect(authUrl);
}
