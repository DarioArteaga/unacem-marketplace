import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstadoBadge } from "@/components/EstadoBadge";
import { MdxContent } from "@/components/MdxContent";
import { TagBadge } from "@/components/TagBadge";
import { getAllCasos, getCasoBySlug } from "@/lib/casos";
import { resolveEstado } from "@/lib/estado";
import { sortTagsForDisplay } from "@/lib/tags";

type CasoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return getAllCasos().map((caso) => ({ slug: caso.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CasoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCasoBySlug(slug);
  if (!caso) {
    return { title: "Caso no encontrado" };
  }
  return {
    title: caso.titulo,
    description: caso.resumen,
  };
}

export default async function CasoPage({ params }: CasoPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const caso = getCasoBySlug(slug);

  if (!caso) {
    notFound();
  }

  const estado = resolveEstado(caso.estado, caso.tags);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex text-sm font-medium text-brand outline-none transition hover:text-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        ← Volver a los casos
      </Link>

      <header className="mb-10 border-b border-ink-muted/15 pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <EstadoBadge estado={estado} />
          {caso.herramienta ? (
            <span className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink-muted ring-1 ring-ink-muted/15">
              {caso.herramienta}
            </span>
          ) : null}
          <ul className="flex flex-wrap gap-2" aria-label="Etiquetas">
            {sortTagsForDisplay(caso.tags).map((tag) => (
              <li key={tag}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          {caso.titulo}
        </h1>
        <p className="mt-4 text-base text-ink">
          <span className="font-medium">{caso.champion}</span>
          <span className="text-ink-muted"> · {caso.area}</span>
        </p>
        <p className="mt-3 text-ink-muted">{caso.resumen}</p>
      </header>

      <MdxContent source={caso.content} />
    </article>
  );
}
