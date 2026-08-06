import { CasoGrid } from "@/components/CasoGrid";
import { fetchCasosPublic } from "@/lib/api/public";
import type { CasoPublic } from "@/lib/api/types";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

async function loadHomeData(): Promise<CasoPublic[]> {
  try {
    const casosPage = await fetchCasosPublic({ page_size: 100 });
    return casosPage.items;
  } catch {
    return [];
  }
}

export default async function HomePage(): Promise<React.ReactElement> {
  const casos = await loadHomeData();

  return (
    <>
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, #8C1A2B 0%, transparent 42%), radial-gradient(circle at 88% 0%, #1A1A1A 0%, transparent 32%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-medium tracking-wide text-white/80 uppercase">
            Grupo UNACEM
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {SITE_DESCRIPTION} Descubre cómo equipos de distintas áreas resolvieron problemas
            reales de su día a día.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            {casos.length} {casos.length === 1 ? "caso publicado" : "casos publicados"}
          </p>
          <a
            href="/api/casos/export-pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-muted/20 bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-brand/40 hover:text-brand"
          >
            Descargar catálogo (PDF)
          </a>
        </div>
        <CasoGrid casos={casos} />
      </div>
    </>
  );
}
