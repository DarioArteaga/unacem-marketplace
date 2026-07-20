import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "salto_token";

function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

type ProxyBody = {
  path: string;
  method?: string;
  body?: unknown;
};

export async function POST(request: Request): Promise<NextResponse> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ detail: "No autenticado", status_code: 401 }, { status: 401 });
  }

  const payload = (await request.json()) as ProxyBody;
  if (!payload.path || !payload.path.startsWith("/api/v1/")) {
    return NextResponse.json({ detail: "Path inválido", status_code: 400 }, { status: 400 });
  }

  const method = (payload.method ?? "GET").toUpperCase();
  const response = await fetch(`${backendBaseUrl()}${payload.path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(payload.body ?? {}),
    cache: "no-store",
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";
  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": contentType },
  });
}
