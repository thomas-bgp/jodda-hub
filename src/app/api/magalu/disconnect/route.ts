import { NextResponse } from "next/server";
import { BASE_URL, removeMagaluToken } from "@/lib/magalu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Apaga o token local. A Magalu não tem URL de revogação documentada: o lojista
// remove o acesso do app pela conta ID Magalu dele, se quiser.
export async function GET() {
  await removeMagaluToken(getSession()?.tenant);
  return NextResponse.redirect(`${BASE_URL}/dashboard/magalu?disconnected=1`);
}
