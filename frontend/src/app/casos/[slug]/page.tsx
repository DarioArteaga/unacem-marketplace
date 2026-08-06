import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvanceCard } from "@/components/AvanceCard";
import { FlujoPasos } from "@/components/FlujoPasos";
import { MetricasCaso } from "@/components/MetricasCaso";
import { RecursosCaso } from "@/components/RecursosCaso";
import { TagBadge } from "@/components/TagBadge";
import { fetchCasoBySlug, fetchCasoSlugs } from "@/lib/api/public";
import { formatEtapaLabel } from "@/lib/etapa";

type CasoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await fetchCasoSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: CasoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caso = await fetchCasoBySlug(slug);
  if (!caso) {
    return { title: "Caso no encontrado" };
  }
  return {
    title: caso.titulo,
    description: caso.resumen,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement | null {
  if (!children) {
    return null;
  }
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-2xl font-semibold text-brand">{title}</h2>
      <div className="text-base leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export default async function CasoPage({ params }: CasoPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const caso = await fetchCasoBySlug(slug);
  if (!caso) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex text-sm font-medium text-brand outline-none transition hover:text-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        ← Volver a los casos
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <header className="mb-8 border-b border-ink-muted/15 pb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {caso.codigo ? (
                <span className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink-muted ring-1 ring-ink-muted/15">
                  {caso.codigo}
                </span>
              ) : null}
              <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white">
                {formatEtapaLabel(caso.etapa_actual)}
              </span>
              {caso.herramientas.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-ink-muted"
                >
                  {tool}
                </span>
              ))}
              {caso.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              {caso.titulo}
            </h1>
            <p className="mt-4 text-base text-ink">
              <span className="font-medium">{caso.champion}</span>
              <span className="text-ink-muted"> · {caso.area}</span>
            </p>
            {caso.beneficiarios.length > 0 ? (
              <p className="mt-2 text-sm text-ink-muted">
                Beneficia: {caso.beneficiarios.join(" · ")}
              </p>
            ) : null}
            <p className="mt-3 text-ink-muted">{caso.resumen}</p>
            <a
              href={`/api/casos/${caso.slug}/export-pdf`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-muted/20 bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-brand/40 hover:text-brand"
            >
              Descargar ficha (PDF)
            </a>
          </header>

          <Section title="Descripción">
            {caso.descripcion ? <p>{caso.descripcion}</p> : null}
          </Section>
          <Section title="Problema que resuelve">
            {caso.problema ? <p>{caso.problema}</p> : null}
          </Section>
          <Section title="Público objetivo">
            {caso.publico_objetivo ? <p>{caso.publico_objetivo}</p> : null}
          </Section>
          <Section title="Diseño · Sistemas">
            {caso.diseno ? <p>{caso.diseno}</p> : null}
          </Section>
          <Section title="Valor esperado">
            {caso.valor_esperado ? <p>{caso.valor_esperado}</p> : null}
          </Section>
          <Section title="Alcance">{caso.alcance ? <p>{caso.alcance}</p> : null}</Section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-2xl font-semibold text-brand">El flujo</h2>
            <FlujoPasos flujo={caso.flujo} />
          </section>

          <RecursosCaso
            title="Prompts personalizados"
            items={caso.prompts ?? []}
            description="Copia y adapta los prompts que el champion usó en este caso."
          />
          <RecursosCaso
            title="Skills"
            items={caso.skills ?? []}
            description="Skills e instrucciones reutilizables compartidas por el champion."
          />

          <MetricasCaso caso={caso} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <AvanceCard caso={caso} />
        </div>
      </div>
    </article>
  );
}
