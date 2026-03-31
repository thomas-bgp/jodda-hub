import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
