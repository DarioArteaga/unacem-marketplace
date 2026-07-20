"use client";

import { useMemo, useState } from "react";
import { CasoCard } from "@/components/CasoCard";
import { ChampionCard } from "@/components/ChampionCard";
import { TagFilter } from "@/components/TagFilter";
import type { CasoPublic } from "@/lib/api/types";

type CasoGridProps = {
  casos: CasoPublic[];
  tags: string[];
};

type ChampionGroup = {
  champion: string;
  areas: string[];
  casos: CasoPublic[];
};

function groupByChampion(casos: CasoPublic[]): ChampionGroup[] {
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
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) {
      return casos;
    }
    if (activeTag === "enproceso") {
      return casos.filter((caso) => caso.estado === "enproceso");
    }
    return casos.filter((caso) => caso.tags.includes(activeTag));
  }, [activeTag, casos]);

  const groups = useMemo(() => groupByChampion(filtered), [filtered]);
  const activeGroup = useMemo(
    () => groups.find((group) => group.champion === selectedChampion) ?? null,
    [groups, selectedChampion],
  );
  const showingCases = selectedChampion !== null;

  return (
    <section aria-labelledby="casos-heading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="casos-heading" className="font-serif text-2xl font-semibold text-brand">
            {showingCases && activeGroup ? activeGroup.champion : "Champions"}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {showingCases && activeGroup
              ? activeGroup.areas.join(" · ")
              : "Elige un champion para ver sus casos. También puedes filtrar por área o tema."}
          </p>
        </div>
        <TagFilter tags={tags} activeTag={activeTag} onChange={setActiveTag} />
      </div>

      {showingCases ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedChampion(null)}
            className="inline-flex text-sm font-medium text-brand outline-none transition hover:text-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            ← Volver a champions
          </button>
          {!activeGroup || activeGroup.casos.length === 0 ? (
            <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
              Este champion no tiene casos con esa etiqueta.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeGroup.casos.map((caso) => (
                <li key={caso.slug}>
                  <CasoCard caso={caso} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : groups.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
          No hay casos publicados todavía.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={group.champion}>
              <ChampionCard
                champion={group.champion}
                areas={group.areas}
                caseCount={group.casos.length}
                onSelect={() => setSelectedChampion(group.champion)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
