import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Sessão assinada (HMAC-SHA256). O tenant da sessão decide QUAIS tokens de
// marketplace o usuário enxerga: tenant "" = legado (Renalbor no ML).
// O login de revisão da Shopee usa um tenant próprio, sem dados de cliente.

export const SESSION_COOKIE = "hub-session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

export interface HubUser {
  email: string;
  password: string;
  tenant: string;
  name: string;
}

export interface Session {
  email: string;
  tenant: string;
  name: string;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET não configurada");
  return s;
}

// HUB_USERS = JSON [{"email","password","tenant","name"}]
export function loadUsers(): HubUser[] {
  try {
    const parsed = JSON.parse(process.env.HUB_USERS || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("HUB_USERS inválido:", error);
    return [];
  }
}

export function findUser(email: string, password: string): HubUser | null {
  const user = loadUsers().find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!user) return null;
  const a = Buffer.from(user.password);
  const b = Buffer.from(String(password));
  return a.length === b.length && timingSafeEqual(a, b) ? user : null;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue(user: HubUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      e: user.email,
      t: user.tenant || "",
      n: user.name || user.email,
      x: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function sessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}

export function parseSession(value?: string | null): Session | null {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.x || data.x < Date.now() / 1000) return null;
    return { email: data.e, tenant: data.t || "", name: data.n || data.e };
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  return parseSession(cookies().get(SESSION_COOKIE)?.value);
}
