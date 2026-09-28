import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { authorizeUrl, magaluSlug } from "@/lib/magalu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// ?client=<slug> = link de onboarding enviado ao lojista; sem ele usa o tenant da sessão.
// O redirect_uri registrado não aceita query, então cliente + origem vão no state
// ("p" = link público, "s" = sessão), com um nonce conferido no callback via cookie.
export async function GET(request: NextRequest) {
  const publicClient = request.nextUrl.searchParams.get("client");
  const client = magaluSlug(publicClient ?? getSession()?.tenant ?? "");
  const nonce = randomBytes(12).toString("hex");
  const state = `${publicClient !== null ? "p" : "s"}.${client}.${nonce}`;

  try {
    const res = NextResponse.redirect(authorizeUrl(state));
    res.cookies.set("magalu_oauth_nonce", nonce, { httpOnly: true, path: "/", maxAge: 900, sameSite: "lax", secure: true });
    return res;
  } catch (error) {
    console.error("Magalu auth link falhou:", { client, error });
    return NextResponse.json({ error: "Integração Magalu não configurada." }, { status: 500 });
  }
}
