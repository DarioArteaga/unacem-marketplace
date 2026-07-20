import { NextResponse } from "next/server";
import { registerRequest } from "@/lib/api/serverAdmin";

type RegisterBody = {
  email?: string;
  password?: string;
  nombre?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as RegisterBody;
  if (!body.email || !body.password || !body.nombre) {
    return NextResponse.json(
      { detail: "Nombre, correo y contraseña son obligatorios", status_code: 400 },
      { status: 400 },
    );
  }
  try {
    const user = await registerRequest(body.email, body.password, body.nombre);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Error al registrar";
    return NextResponse.json({ detail, status_code: 400 }, { status: 400 });
  }
}
