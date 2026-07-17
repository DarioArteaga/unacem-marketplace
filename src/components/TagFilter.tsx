"use client";

import { formatTagLabel, isStatusTag } from "@/lib/tags";

type TagFilterProps = {
  tags: string[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
};

function chipClass(isActive: boolean, status: boolean): string {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted";
  if (isActive) {
    return status
      ? `${base} bg-brand text-white`
      : `${base} bg-brand-accent text-white`;
  }
  return status
    ? `${base} bg-brand/10 text-brand ring-1 ring-brand/30 hover:bg-brand/15`
    : `${base} bg-surface text-ink-muted ring-1 ring-ink-muted/20 hover:text-brand hover:ring-brand/40`;
}

export function TagFilter({ tags, activeTag, onChange }: TagFilterProps): React.ReactElement {
  const ordered = [...tags].sort((a, b) => {
    const aStatus = isStatusTag(a);
    const bStatus = isStatusTag(b);
    if (aStatus && !bStatus) {
      return -1;
    }
    if (!aStatus && bStatus) {
      return 1;
    }
    return formatTagLabel(a).localeCompare(formatTagLabel(b), "es");
  });

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrar casos por etiqueta"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        className={chipClass(activeTag === null, false)}
        aria-pressed={activeTag === null}
      >
        Todos
      </button>
      {ordered.map((tag) => {
        const isActive = activeTag === tag;
        const status = isStatusTag(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(isActive ? null : tag)}
            className={chipClass(isActive, status)}
            aria-pressed={isActive}
          >
            {formatTagLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}
