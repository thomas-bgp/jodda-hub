import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Magalu (ID Magalu, OAuth 2.0 authorization code). Só existe ambiente de produção.
// O client "Jodda Hub" foi criado com o idm CLI; o redirect_uri registrado é fixo
// (/api/magalu/callback, sem query), então o cliente viaja no `state`.
// Docs: https://developers.magalu.com/docs/first-steps/create-an-application/authentication-authorization

export const BASE_URL =
  process.env.PUBLIC_BASE_URL || "https://ecomerce.bertuzzipatrimonial.com.br";

const ID_URL = "https://id.magalu.com";
const API_URL = "https://api.magalu.com";

export const MAGALU_SCOPES = [
  "open:order-order-seller:read",
  "open:order-invoice-seller:read",
  "open:portfolio-skus-seller:read",
  "open:portfolio-prices-seller:read",
  "open:portfolio-stocks-seller:read",
].join(" ");

interface MagaluToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

function config() {
  const clientId = process.env.MAGALU_CLIENT_ID || "";
  const clientSecret = process.env.MAGALU_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) {
    throw new Error("MAGALU_CLIENT_ID/MAGALU_CLIENT_SECRET não configurados");
  }
  return { clientId, clientSecret };
}

export function magaluSlug(client?: string | null): string {
  return (client || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

function tokenPath(client?: string | null): string {
  const slug = magaluSlug(client);
  return path.join(DATA_DIR, `magalu-token-${slug || "default"}.json`);
}

export function callbackUrl(): string {
  return `${BASE_URL}/api/magalu/callback`;
}

// choose_tenants=true faz o seller escolher a loja (organização PJ) no consentimento.
export function authorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config().clientId,
    redirect_uri: callbackUrl(),
    scope: MAGALU_SCOPES,
    response_type: "code",
    choose_tenants: "true",
    state,
  });
  return `${ID_URL}/login?${params.toString()}`;
}

async function storeToken(client: string | null | undefined, data: any, previous?: MagaluToken) {
  const token: MagaluToken = {
    access_token: data.access_token,
    // Se a Magalu não devolver um refresh novo, continua valendo o anterior.
    refresh_token: data.refresh_token || previous?.refresh_token || "",
    expires_at: new Date(Date.now() + Number(data.expires_in || 7200) * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(tokenPath(client), JSON.stringify(token, null, 2), "utf-8");
  return token;
}

async function tokenRequest(init: RequestInit) {
  const res = await fetch(`${ID_URL}/oauth/token`, { ...init, method: "POST", cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(`Magalu oauth/token: ${res.status} ${data.error || ""} ${data.error_description || data.message || ""}`);
  }
  return data;
}

// O code vale 10 minutos e é de uso único.
export async function exchangeCode(client: string | null | undefined, code: string) {
  const { clientId, clientSecret } = config();
  const data = await tokenRequest({
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl(),
      code,
      grant_type: "authorization_code",
    }),
  });
  return storeToken(client, data);
}

async function readToken(client?: string | null): Promise<MagaluToken | null> {
  try {
    return JSON.parse(await readFile(tokenPath(client), "utf-8"));
  } catch {
    return null;
  }
}

// access_token vale 2h (--access-token-exp 7200 no client). Renova com 30 min de folga.
export async function getValidMagaluToken(client?: string | null): Promise<MagaluToken | null> {
  const token = await readToken(client);
  if (!token) return null;
  const msLeft = new Date(token.expires_at).getTime() - Date.now();
  if (msLeft > 30 * 60 * 1000) return token;
  try {
    const { clientId, clientSecret } = config();
    const data = await tokenRequest({
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: token.refresh_token,
      }).toString(),
    });
    return await storeToken(client, data, token);
  } catch (error) {
    console.error("Magalu refresh falhou:", { client, error });
    return msLeft > 0 ? token : null;
  }
}

export async function removeMagaluToken(client?: string | null) {
  await unlink(tokenPath(client)).catch(() => undefined);
}

export async function magaluGet(token: MagaluToken, apiPath: string, params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))).toString();
  const res = await fetch(`${API_URL}${apiPath}${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token.access_token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Magalu ${apiPath}: ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

// Valores da API vêm inteiros; divide pelo normalizer (100 para BRL).
export function money(amount?: { total?: number; normalizer?: number } | null): number {
  if (!amount?.total) return 0;
  return amount.total / (amount.normalizer || 100);
}
