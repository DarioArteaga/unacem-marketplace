import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/api/serverAdmin";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ detail: "ok" });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
