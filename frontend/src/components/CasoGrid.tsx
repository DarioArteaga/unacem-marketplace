"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CasoCard } from "@/components/CasoCard";
import { GroupCard } from "@/components/GroupCard";
import { TagBadge } from "@/components/TagBadge";
import type { CasoPublic } from "@/lib/api/types";
import { formatCoachLabel, formatEtapaLabel, formatOlaLabel } from "@/lib/etapa";

type CasoGridProps = {
  casos: CasoPublic[];
};

type TabKey = "area" | "coach" | "ola" | "lista";

const TABS: { key: TabKey; label: string }[] = [
  { key: "area", label: "Vista por área" },
  { key: "coach", label: "Vista por coach" },
  { key: "ola", label: "Vista por ola" },
  { key: "lista", label: "Vista por lista" },
];

type Group = {
  key: string;
  title: string;
  subtitle: string;
  casos: CasoPublic[];
};

function groupBy(
  casos: CasoPublic[],
  keyOf: (caso: CasoPublic) => string,
  labelOf: (key: string) => string,
  subtitleOf: (casos: CasoPublic[]) => string,
): Group[] {
  const map = new Map<string, CasoPublic[]>();
  for (const caso of casos) {
    const key = keyOf(caso);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(caso);
    } else {
      map.set(key, [caso]);
    }
  }
  return Array.from(map.entries())
    .map(([key, items]) => ({
      key,
      title: labelOf(key),
      subtitle: subtitleOf(items),
      casos: items,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "es"));
}

function uniqueList(values: string[]): string {
  return Array.from(new Set(values)).join(" · ");
}

export function CasoGrid({ casos }: CasoGridProps): React.ReactElement {
  const [tab, setTab] = useState<TabKey>("area");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const areaGroups = useMemo(
    () =>
      groupBy(
        casos,
        (c) => c.area,
        (key) => key,
        (items) => uniqueList(items.map((c) => c.champion)),
      ),
    [casos],
  );
  const coachGroups = useMemo(
    () =>
      groupBy(
        casos,
        (c) => c.coach ?? "sin_coach",
        (key) => (key === "sin_coach" ? "Sin coach asignado" : formatCoachLabel(key as "jhonatan" | "dario")),
        (items) => uniqueList(items.map((c) => c.area)),
      ),
    [casos],
  );
  const olaGroups = useMemo(
    () =>
      groupBy(
        casos,
        (c) => c.ola ?? "sin_ola",
        (key) => (key === "sin_ola" ? "Sin ola asignada" : formatOlaLabel(key as "ola_1" | "ola_2" | "ola_3")),
        (items) => uniqueList(items.map((c) => c.area)),
      ),
    [casos],
  );

  const groupsByTab: Record<Exclude<TabKey, "lista">, Group[]> = {
    area: areaGroups,
    coach: coachGroups,
    ola: olaGroups,
  };

  function changeTab(next: TabKey): void {
    setTab(next);
    setSelectedKey(null);
  }

  if (tab === "lista") {
    return (
      <section aria-labelledby="casos-heading" className="space-y-6">
        <Tabs active={tab} onChange={changeTab} />
        <ListaCasos casos={casos} />
      </section>
    );
  }

  const groups = groupsByTab[tab];
  const activeGroup = groups.find((g) => g.key === selectedKey) ?? null;
  const showingCases = selectedKey !== null;

  return (
    <section aria-labelledby="casos-heading" className="space-y-6">
      <Tabs active={tab} onChange={changeTab} />

      <div>
        <h2 id="casos-heading" className="font-serif text-2xl font-semibold text-brand">
          {showingCases && activeGroup ? activeGroup.title : "Selecciona un grupo"}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {showingCases && activeGroup ? activeGroup.subtitle : "Elige un grupo para ver sus casos."}
        </p>
      </div>

      {showingCases ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedKey(null)}
            className="inline-flex text-sm font-medium text-brand outline-none transition hover:text-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            ← Volver
          </button>
          {!activeGroup || activeGroup.casos.length === 0 ? (
            <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
              Este grupo no tiene casos publicados.
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
            <li key={group.key}>
              <GroupCard
                title={group.title}
                subtitle={group.subtitle}
                caseCount={group.casos.length}
                onSelect={() => setSelectedKey(group.key)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}): React.ReactElement {
  return (
    <div
      role="tablist"
      aria-label="Agrupar casos del marketplace"
      className="flex flex-wrap gap-2 border-b border-ink-muted/10 pb-3"
    >
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
            active === t.key
              ? "bg-brand text-white"
              : "bg-surface text-ink-muted ring-1 ring-ink-muted/15 hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ListaCasos({ casos }: { casos: CasoPublic[] }): React.ReactElement {
  if (casos.length === 0) {
    return (
      <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
        No hay casos publicados todavía.
      </p>
    );
  }

  const sorted = [...casos].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-ink-muted/10">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-ink-muted/10 text-xs tracking-wide text-ink-muted uppercase">
          <tr>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Resumen</th>
            <th className="px-4 py-3">Champion</th>
            <th className="px-4 py-3">Área</th>
            <th className="px-4 py-3">Coach</th>
            <th className="px-4 py-3">Ola</th>
            <th className="px-4 py-3">Etapa</th>
            <th className="px-4 py-3">Avance</th>
            <th className="px-4 py-3">Etiquetas</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((caso) => (
            <tr key={caso.slug} className="border-b border-ink-muted/5 last:border-0">
              <td className="px-4 py-3 font-medium text-ink">
                <Link
                  href={`/casos/${caso.slug}`}
                  className="text-brand underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  {caso.titulo}
                </Link>
              </td>
              <td className="max-w-xs px-4 py-3 text-ink-muted">{caso.resumen}</td>
              <td className="px-4 py-3 text-ink-muted">{caso.champion}</td>
              <td className="px-4 py-3 text-ink-muted">{caso.area}</td>
              <td className="px-4 py-3 text-ink-muted">{formatCoachLabel(caso.coach)}</td>
              <td className="px-4 py-3 text-ink-muted">{formatOlaLabel(caso.ola)}</td>
              <td className="px-4 py-3 text-ink-muted">{formatEtapaLabel(caso.etapa_actual)}</td>
              <td className="px-4 py-3 text-ink-muted">{caso.avance_pct}%</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {caso.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
