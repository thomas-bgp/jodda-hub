import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { BASE_URL } from "@/lib/shopee";

function logout(_request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", BASE_URL));
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

export const GET = logout;
export const POST = logout;
