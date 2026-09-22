import { NextRequest, NextResponse } from "next/server";
import { createSessionValue, findUser, sessionMaxAge, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = findUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, createSessionValue(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge(),
  });
  return response;
}
