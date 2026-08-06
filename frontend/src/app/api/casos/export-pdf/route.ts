function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

/** Proxy público (sin auth): el catálogo de casos ya es información pública del marketplace. */
export async function GET(): Promise<Response> {
  const response = await fetch(`${backendBaseUrl()}/api/v1/casos/export.pdf`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return new Response("No se pudo generar el PDF del catálogo.", { status: response.status });
  }
  const buffer = await response.arrayBuffer();
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="catalogo-casos-proyecto-salto.pdf"',
    },
  });
}
