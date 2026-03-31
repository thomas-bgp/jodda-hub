import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

interface MlToken {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_at: string;
  updated_at: string;
}

const TOKEN_PATH = path.join(process.cwd(), "data", "ml-token.json");

export async function getValidToken(): Promise<MlToken | null> {
  let token: MlToken;
  try {
    const raw = await readFile(TOKEN_PATH, "utf-8");
    token = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!token.access_token || !token.refresh_token) return null;

  // Check if token expires in less than 30 minutes
  const expiresAt = new Date(token.expires_at).getTime();
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  if (expiresAt - now < thirtyMinutes) {
    // Token expired or about to expire — refresh it
    const refreshed = await refreshToken(token);
    if (refreshed) return refreshed;
    // If refresh fails but token hasn't fully expired, try using it anyway
    if (expiresAt > now) return token;
    return null;
  }

  return token;
}

async function refreshToken(token: MlToken): Promise<MlToken | null> {
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

    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await writeFile(TOKEN_PATH, JSON.stringify(updated, null, 2), "utf-8");
    console.log("ML token auto-refreshed for user_id:", updated.user_id);

    return updated;
  } catch (err) {
    console.error("ML auto-refresh error:", err);
    return null;
  }
}
