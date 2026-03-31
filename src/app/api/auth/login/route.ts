import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (email === "teste@jodda.com" && password === "Teste@2025") {
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", "authenticated", {
      httpOnly: true,
      path: "/",
      maxAge: 86400,
    });
    return response;
  }

  return NextResponse.json(
    { error: "Credenciais inválidas" },
    { status: 401 }
  );
}
