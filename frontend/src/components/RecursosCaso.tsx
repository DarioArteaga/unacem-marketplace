"use client";

import { useState } from "react";
import type { RecursoTexto } from "@/lib/api/types";

type RecursosCasoProps = {
  title: string;
  items: RecursoTexto[];
  description: string;
};

export function RecursosCaso({
  title,
  items,
  description,
}: RecursosCasoProps): React.ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-2xl font-semibold text-brand">{title}</h2>
      <p className="mb-4 text-sm text-ink-muted">{description}</p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <RecursoItem key={`${item.titulo}-${index}`} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}

function RecursoItem({
  item,
  index,
}: {
  item: RecursoTexto;
  index: number;
}): React.ReactElement {
  const [open, setOpen] = useState(index === 0);
  const [copied, setCopied] = useState(false);

  async function onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(item.contenido);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-ink-muted/10 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          aria-expanded={open}
        >
          <span className="shrink-0 text-xs font-medium text-ink-muted" aria-hidden="true">
            {open ? "▾" : "▸"}
          </span>
          <span className="truncate font-medium text-ink">{item.titulo}</span>
        </button>
        <button
          type="button"
          onClick={() => void onCopy()}
          className="shrink-0 rounded-lg border border-ink-muted/20 bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink"
        >
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
      </div>
      {open ? (
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words border-t border-ink-muted/10 bg-surface-muted px-4 py-3 font-mono text-xs leading-relaxed text-ink">
          {item.contenido}
        </pre>
      ) : null}
    </li>
  );
}
