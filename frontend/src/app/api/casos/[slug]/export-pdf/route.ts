function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

type RouteParams = { params: Promise<{ slug: string }> };

/** Proxy público (sin auth): la ficha de un caso publicado ya es información pública. */
export async function GET(_request: Request, { params }: RouteParams): Promise<Response> {
  const { slug } = await params;
  const response = await fetch(
    `${backendBaseUrl()}/api/v1/casos/${encodeURIComponent(slug)}/export.pdf`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    return new Response("No se pudo generar el PDF del caso.", { status: response.status });
  }
  const buffer = await response.arrayBuffer();
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
    },
  });
}
