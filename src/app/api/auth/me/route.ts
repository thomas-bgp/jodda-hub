import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  return NextResponse.json({ name: session.name, email: session.email });
}
