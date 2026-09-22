import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Roda no edge: valida a assinatura com Web Crypto (mesmo HMAC de lib/session.ts).
// Rotas de dados de marketplace exigem sessão; OAuth (auth/callback), refresh e
// /api/internal (chave própria) continuam públicas.
const PROTECTED_API = [
  /^\/api\/mercadolivre\/(seller|items|orders|metrics|status)/,
  /^\/api\/shopee\/(status|shop|orders|disconnect)/,
];

async function isValidSession(value?: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!value || !secret) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (expected !== sig) return false;

  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).x > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const valid = await isValidSession(request.cookies.get("hub-session")?.value);
  if (valid) return NextResponse.next();

  if (PROTECTED_API.some((re) => re.test(pathname))) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/mercadolivre/:route(seller|items|orders|metrics|status)",
    "/api/shopee/:route(status|shop|orders|disconnect)",
  ],
};
