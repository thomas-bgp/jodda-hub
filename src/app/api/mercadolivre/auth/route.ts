import { NextResponse } from "next/server";

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

  const authUrl =
    `https://auth.mercadolivre.com.br/authorization` +
    `?response_type=code` +
    `&client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(authUrl);
}
