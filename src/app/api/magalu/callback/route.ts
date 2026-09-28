import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, exchangeCode, magaluSlug } from "@/lib/magalu";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const [origin, rawClient, nonce] = (params.get("state") || "").split(".");
  const client = magaluSlug(rawClient);
  const isPublic = origin === "p";
  // Link público: o lojista não tem login no Hub, então o erro vai para uma página aberta.
  const fail = (reason: string) =>
    NextResponse.redirect(
      isPublic ? `${BASE_URL}/conectar/erro` : `${BASE_URL}/dashboard/magalu?error=${reason}`
    );

  if (!code) return fail(params.get("error") || "missing_code");
  if (!nonce || request.cookies.get("magalu_oauth_nonce")?.value !== nonce) {
    console.error("Magalu callback com state inválido:", { client });
    return fail("state");
  }

  try {
    await exchangeCode(client, code);
    console.info("Magalu token salvo:", { client: client || "(default)" });
    const target = isPublic ? "/conectado?mp=magalu" : "/dashboard/magalu?connected=1";
    const res = NextResponse.redirect(`${BASE_URL}${target}`);
    res.cookies.delete("magalu_oauth_nonce");
    return res;
  } catch (error) {
    console.error("Magalu callback falhou:", { client, error });
    return fail("token");
  }
}
