import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

interface MlToken {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

// Sanitiza o slug do cliente. Vazio/undefined => arquivo legado single-tenant
// (ml-token.json), que é o token da Renalbor já existente. NÃO mexer nesse
// comportamento para não quebrar o auto-refresh dela.
export function clientSlug(client?: string | null): string {
  return (client || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

export function tokenFilePath(client?: string | null): string {
  const slug = clientSlug(client);
  return path.join(DATA_DIR, slug ? `ml-token-${slug}.json` : "ml-token.json");
}

export async function getValidToken(
  client?: string | null
): Promise<MlToken | null> {
  const TOKEN_PATH = tokenFilePath(client);

  let token: MlToken;
  try {
    const raw = await readFile(TOKEN_PATH, "utf-8");
    token = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!token.access_token || !token.refresh_token) return null;

  // Renova se faltar menos de 30 minutos para expirar
  const expiresAt = new Date(token.expires_at).getTime();
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  if (expiresAt - now < thirtyMinutes) {
    const refreshed = await refreshAndStore(token, client);
    if (refreshed) return refreshed;
    // Se o refresh falhou mas o token ainda não expirou de fato, usa mesmo assim
    if (expiresAt > now) return token;
    return null;
  }

  return token;
}

// Renova via refresh_token e persiste o NOVO token (incl. refresh_token rotativo
// — uso único no ML) no arquivo do mesmo cliente.
export async function refreshAndStore(
  token: MlToken,
  client?: string | null
): Promise<MlToken | null> {
  const appId = process.env.ML_APP_ID;
  const appSecret = process.env.ML_APP_SECRET;

  if (!appId || !appSecret) return null;

  try {
    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: appId,
        client_secret: appSecret,
        refresh_token: token.refresh_token,
      }),
    });

    if (!res.ok) {
      console.error("ML auto-refresh failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    const updated: MlToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(
      tokenFilePath(client),
      JSON.stringify(updated, null, 2),
      "utf-8"
    );
    console.log(
      "ML token auto-refreshed for client:",
      clientSlug(client) || "(legacy)",
      "user_id:",
      updated.user_id
    );

    return updated;
  } catch (err) {
    console.error("ML auto-refresh error:", err);
    return null;
  }
}
