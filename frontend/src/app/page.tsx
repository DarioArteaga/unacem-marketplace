import { CasoGrid } from "@/components/CasoGrid";
import { fetchCasosPublic, fetchTags } from "@/lib/api/public";
import type { CasoPublic } from "@/lib/api/types";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

async function loadHomeData(): Promise<{ casos: CasoPublic[]; tags: string[] }> {
  try {
    const [casosPage, tags] = await Promise.all([
      fetchCasosPublic({ page_size: 100 }),
      fetchTags(),
    ]);
    const hasEnProceso = casosPage.items.some((c) => c.estado === "enproceso");
    const filterTags = hasEnProceso ? ["enproceso", ...tags] : tags;
    return { casos: casosPage.items, tags: filterTags };
  } catch {
    return { casos: [], tags: [] };
  }
}

export default async function HomePage(): Promise<React.ReactElement> {
  const { casos, tags } = await loadHomeData();

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
        <CasoGrid casos={casos} tags={tags} />
      </div>
    </>
  );
}
