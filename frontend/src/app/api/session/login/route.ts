import { NextResponse } from "next/server";
import { getSessionCookieName, loginRequest } from "@/lib/api/serverAdmin";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as LoginBody;
  if (!body.email || !body.password) {
    return NextResponse.json(
      { detail: "Correo y contraseña son obligatorios", status_code: 400 },
      { status: 400 },
    );
  }
  try {
    const token = await loginRequest(body.email, body.password);
    const response = NextResponse.json({ detail: "ok" });
    response.cookies.set(getSessionCookieName(), token.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Error de autenticación";
    return NextResponse.json({ detail, status_code: 401 }, { status: 401 });
  }
}
