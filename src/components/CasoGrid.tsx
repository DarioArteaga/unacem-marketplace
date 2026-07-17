"use client";

import { useMemo, useState } from "react";
import { CasoCard } from "@/components/CasoCard";
import { TagFilter } from "@/components/TagFilter";
import type { CasoCardData } from "@/lib/schema";

type CasoGridProps = {
  casos: CasoCardData[];
  tags: string[];
};

type ChampionGroup = {
  champion: string;
  areas: string[];
  casos: CasoCardData[];
};

function groupByChampion(casos: CasoCardData[]): ChampionGroup[] {
  const map = new Map<string, ChampionGroup>();

  for (const caso of casos) {
    const existing = map.get(caso.champion);
    if (existing) {
      existing.casos.push(caso);
      if (!existing.areas.includes(caso.area)) {
        existing.areas.push(caso.area);
      }
    } else {
      map.set(caso.champion, {
        champion: caso.champion,
        areas: [caso.area],
        casos: [caso],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.champion.localeCompare(b.champion, "es"),
  );
}

export function CasoGrid({ casos, tags }: CasoGridProps): React.ReactElement {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) {
      return casos;
    }
    return casos.filter((caso) => caso.tags.includes(activeTag));
  }, [activeTag, casos]);

  const groups = useMemo(() => groupByChampion(filtered), [filtered]);

  return (
    <section aria-labelledby="casos-heading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="casos-heading" className="font-serif text-2xl font-semibold text-brand">
            Casos de uso
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Agrupados por champion. Filtra por área o tema para encontrar algo cercano a tu
            trabajo.
          </p>
        </div>
        <TagFilter tags={tags} activeTag={activeTag} onChange={setActiveTag} />
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
          No hay casos con esa etiqueta.
        </p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => {
            const headingId = `champion-${group.champion.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <section key={group.champion} aria-labelledby={headingId} className="space-y-4">
                <div className="border-b border-ink-muted/15 pb-3">
                  <h3 id={headingId} className="font-serif text-xl font-semibold text-ink">
                    {group.champion}
                  </h3>
                  <p className="mt-0.5 text-sm text-ink-muted">{group.areas.join(" · ")}</p>
                </div>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.casos.map((caso) => (
                    <li key={caso.slug}>
                      <CasoCard caso={caso} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
