import { NextResponse } from "next/server";
import { cancelAuthorizeUrl, removeShopeeToken } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Apaga o token local e manda o lojista revogar a autorização na Shopee.
export async function GET() {
  const tenant = getSession()?.tenant;
  await removeShopeeToken(tenant);
  try {
    return NextResponse.redirect(cancelAuthorizeUrl());
  } catch (error) {
    console.error("Shopee disconnect falhou:", { tenant, error });
    return NextResponse.json({ error: "Integração Shopee não configurada." }, { status: 500 });
  }
}
