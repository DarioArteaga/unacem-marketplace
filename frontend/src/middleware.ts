import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "salto_token";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/register" ||
    pathname.startsWith("/admin/login/") ||
    pathname.startsWith("/admin/register/")
  ) {
    return NextResponse.next();
  }
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
