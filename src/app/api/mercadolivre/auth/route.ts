import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

export async function GET() {
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

  // Generate PKCE code_verifier and code_challenge
  const codeVerifier = randomBytes(32)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 128);

  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Store code_verifier in cookie for callback
  const cookieStore = await cookies();
  cookieStore.set("ml_code_verifier", codeVerifier, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",
  });

  const authUrl =
    `https://auth.mercadolivre.com.br/authorization` +
    `?response_type=code` +
    `&client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  return NextResponse.redirect(authUrl);
}
