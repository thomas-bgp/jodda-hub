import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tokenPath = path.join(process.cwd(), "data", "ml-token.json");
    const raw = await readFile(tokenPath, "utf-8");
    const token = JSON.parse(raw);

    if (token.access_token) {
      return NextResponse.json({
        connected: true,
        user_id: token.user_id,
        expires_at: token.expires_at,
      });
    }

    return NextResponse.json({ connected: false });
  } catch {
    // File doesn't exist or is invalid
    return NextResponse.json({ connected: false });
  }
}
