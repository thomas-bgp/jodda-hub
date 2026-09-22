import { createHmac } from "crypto";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Shopee Open Platform v2. Assinatura = HMAC-SHA256(partner_key,
// partner_id + path + timestamp [+ access_token + shop_id]) em hex.
// SHOPEE_HOST: sandbox v2 = https://openplatform.sandbox.test-stable.shopee.sg
//              (o antigo partner.test-stable.shopeemobile.com responde "Wrong sign" p/ chaves novas),
//              live    = https://partner.shopeemobile.com

export const BASE_URL =
  process.env.PUBLIC_BASE_URL || "https://ecomerce.bertuzzipatrimonial.com.br";

interface ShopeeToken {
  shop_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

function config() {
  const partnerId = Number(process.env.SHOPEE_PARTNER_ID);
  const partnerKey = process.env.SHOPEE_PARTNER_KEY || "";
  const host = process.env.SHOPEE_HOST || "https://openplatform.sandbox.test-stable.shopee.sg";
  if (!partnerId || !partnerKey) {
    throw new Error("SHOPEE_PARTNER_ID/SHOPEE_PARTNER_KEY não configurados");
  }
  return { partnerId, partnerKey, host };
}

export function shopeeSlug(client?: string | null): string {
  return (client || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

function tokenPath(client?: string | null): string {
  const slug = shopeeSlug(client);
  return path.join(DATA_DIR, `shopee-token-${slug || "default"}.json`);
}

function signedUrl(apiPath: string, extra: Record<string, string | number> = {}, auth?: ShopeeToken) {
  const { partnerId, partnerKey, host } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const base = `${partnerId}${apiPath}${timestamp}${auth ? auth.access_token + auth.shop_id : ""}`;
  const sign = createHmac("sha256", partnerKey).update(base).digest("hex");
  const params = new URLSearchParams({
    partner_id: String(partnerId),
    timestamp: String(timestamp),
    sign,
    ...(auth ? { access_token: auth.access_token, shop_id: String(auth.shop_id) } : {}),
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
  });
  return `${host}${apiPath}?${params.toString()}`;
}

export function callbackUrl(client?: string | null): string {
  const slug = shopeeSlug(client);
  return `${BASE_URL}/api/shopee/callback${slug ? `?client=${slug}` : ""}`;
}

export function authorizeUrl(client?: string | null): string {
  return signedUrl("/api/v2/shop/auth_partner", { redirect: callbackUrl(client) });
}

export function cancelAuthorizeUrl(): string {
  return signedUrl("/api/v2/shop/cancel_auth_partner", { redirect: `${BASE_URL}/dashboard/shopee` });
}

async function postAuth(apiPath: string, body: Record<string, unknown>) {
  const res = await fetch(signedUrl(apiPath), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, partner_id: config().partnerId }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Shopee ${apiPath}: ${data.error || res.status} ${data.message || ""}`);
  }
  return data;
}

async function storeToken(client: string | null | undefined, shopId: number, data: any) {
  const token: ShopeeToken = {
    shop_id: shopId,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: new Date(Date.now() + Number(data.expire_in) * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(tokenPath(client), JSON.stringify(token, null, 2), "utf-8");
  return token;
}

export async function exchangeCode(client: string | null | undefined, code: string, shopId: number) {
  const data = await postAuth("/api/v2/auth/token/get", { code, shop_id: shopId });
  return storeToken(client, shopId, data);
}

async function readToken(client?: string | null): Promise<ShopeeToken | null> {
  try {
    return JSON.parse(await readFile(tokenPath(client), "utf-8"));
  } catch {
    return null;
  }
}

// access_token vale 4h, refresh_token 30 dias e é rotativo: sempre persistir o novo.
export async function getValidShopeeToken(client?: string | null): Promise<ShopeeToken | null> {
  const token = await readToken(client);
  if (!token) return null;
  const msLeft = new Date(token.expires_at).getTime() - Date.now();
  if (msLeft > 30 * 60 * 1000) return token;
  try {
    const data = await postAuth("/api/v2/auth/access_token/get", {
      refresh_token: token.refresh_token,
      shop_id: token.shop_id,
    });
    return await storeToken(client, token.shop_id, data);
  } catch (error) {
    console.error("Shopee refresh falhou:", { client, shop_id: token.shop_id, error });
    return msLeft > 0 ? token : null;
  }
}

export async function removeShopeeToken(client?: string | null) {
  await unlink(tokenPath(client)).catch(() => undefined);
}

export async function shopeeGet(token: ShopeeToken, apiPath: string, params: Record<string, string | number> = {}) {
  const res = await fetch(signedUrl(apiPath, params, token), { cache: "no-store" });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Shopee ${apiPath}: ${data.error || res.status} ${data.message || ""}`);
  }
  return data.response ?? data;
}
