import { NextRequest, NextResponse } from "next/server";
import { authorizeUrl } from "@/lib/shopee";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// ?client=<slug> = link de onboarding enviado ao lojista; sem ele usa o tenant da sessão.
export async function GET(request: NextRequest) {
  const client = request.nextUrl.searchParams.get("client") ?? getSession()?.tenant ?? "";
  try {
    return NextResponse.redirect(authorizeUrl(client));
  } catch (error) {
    console.error("Shopee auth link falhou:", { client, error });
    return NextResponse.json({ error: "Integração Shopee não configurada." }, { status: 500 });
  }
}
