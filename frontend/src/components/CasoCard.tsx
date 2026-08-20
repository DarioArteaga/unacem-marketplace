"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { CompletadoBadge } from "@/components/CompletadoBadge";
import { TagBadge } from "@/components/TagBadge";
import { UnacemLoader } from "@/components/UnacemLoader";
import type { CasoPublic } from "@/lib/api/types";
import { formatEtapaLabel } from "@/lib/etapa";

type CasoCardProps = {
  caso: CasoPublic;
};

export function CasoCard({ caso }: CasoCardProps): React.ReactElement {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const completado = caso.avance_pct >= 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setPending(true);
    router.push(`/casos/${caso.slug}`);
  }

  return (
    <article className="group h-full">
      {mounted && pending
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-muted/90 backdrop-blur-[2px]">
              <UnacemLoader label="Cargando" compact />
            </div>,
            document.body,
          )
        : null}
      <a
        href={`/casos/${caso.slug}`}
        onClick={handleNavigate}
        className={`flex h-full flex-col rounded-2xl border bg-surface p-5 shadow-sm outline-none transition duration-200 ease-out hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-brand focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted ${
          completado ? "border-brand/40 ring-1 ring-brand/15" : "border-ink-muted/15"
        }`}
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-serif text-xl font-semibold text-brand transition-colors group-hover:text-brand-accent">
            {caso.titulo}
          </h2>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {completado ? <CompletadoBadge /> : null}
            <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white">
              {caso.avance_pct}% · {formatEtapaLabel(caso.etapa_actual)}
            </span>
          </div>
        </div>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{caso.resumen}</p>
        <p className="mb-3 text-sm text-ink">
          <span className="font-medium">{caso.champion}</span>
          <span className="text-ink-muted"> · {caso.area}</span>
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Etiquetas">
          {caso.herramientas.slice(0, 2).map((tool) => (
            <li key={tool}>
              <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-ink-muted">
                {tool}
              </span>
            </li>
          ))}
          {caso.tags.map((tag) => (
            <li key={tag}>
              <TagBadge tag={tag} interactive />
            </li>
          ))}
        </ul>
      </a>
    </article>
  );
}
