"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CasoCard } from "@/components/CasoCard";
import { CompletadoBadge } from "@/components/CompletadoBadge";
import { GroupCard } from "@/components/GroupCard";
import { SelectFilter, TextFilter } from "@/components/TableColumnFilter";
import { TagBadge } from "@/components/TagBadge";
import type { CasoPublic } from "@/lib/api/types";
import { COACH_LABELS, ETAPA_LABELS, OLA_LABELS, formatCoachLabel, formatEtapaLabel, formatOlaLabel } from "@/lib/etapa";

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
      <section aria-labelledby="casos-heading" className="space-y-4">
        <Tabs active={tab} onChange={changeTab} />
        <ListaCasos casos={casos} />
      </section>
    );
  }

  const groups = groupsByTab[tab];
  const activeGroup = groups.find((g) => g.key === selectedKey) ?? null;
  const showingCases = selectedKey !== null;

  return (
    <section aria-labelledby="casos-heading" className="space-y-4">
      <Tabs active={tab} onChange={changeTab} />

      <div>
        <h2 id="casos-heading" className="font-serif text-xl font-semibold text-brand">
          {showingCases && activeGroup ? activeGroup.title : "Selecciona un grupo"}
        </h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          {showingCases && activeGroup ? activeGroup.subtitle : "Elige un grupo para ver sus casos."}
        </p>
      </div>

      {showingCases ? (
        <div className="space-y-3">
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
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      className="flex flex-wrap gap-1.5 border-b border-ink-muted/10 pb-2"
    >
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
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

type ListaFilters = {
  titulo: string;
  champion: string;
  area: string;
  coach: string;
  ola: string;
  etapa: string;
};

const EMPTY_LISTA_FILTERS: ListaFilters = {
  titulo: "",
  champion: "",
  area: "",
  coach: "",
  ola: "",
  etapa: "",
};

function ListaCasos({ casos }: { casos: CasoPublic[] }): React.ReactElement {
  const [filters, setFilters] = useState<ListaFilters>(EMPTY_LISTA_FILTERS);

  function setFilter(key: keyof ListaFilters, value: string): void {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const areaOptions = useMemo(
    () => Array.from(new Set(casos.map((c) => c.area))).sort((a, b) => a.localeCompare(b, "es")),
    [casos],
  );

  const filtered = useMemo(() => {
    const titulo = filters.titulo.trim().toLowerCase();
    const champion = filters.champion.trim().toLowerCase();
    return casos.filter((caso) => {
      if (titulo && !caso.titulo.toLowerCase().includes(titulo)) return false;
      if (champion && !caso.champion.toLowerCase().includes(champion)) return false;
      if (filters.area && caso.area !== filters.area) return false;
      if (filters.coach && caso.coach !== filters.coach) return false;
      if (filters.ola && caso.ola !== filters.ola) return false;
      if (filters.etapa && caso.etapa_actual !== filters.etapa) return false;
      return true;
    });
  }, [casos, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");
  const sorted = [...filtered].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));

  if (casos.length === 0) {
    return (
      <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
        No hay casos publicados todavía.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            {sorted.length} de {casos.length} casos
          </p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_LISTA_FILTERS)}
            className="text-sm font-medium text-brand hover:text-brand-accent"
          >
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-ink-muted/10">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-muted/10 text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="px-4 py-3 align-top">
                  Título
                  <TextFilter label="título" value={filters.titulo} onChange={(v) => setFilter("titulo", v)} />
                </th>
                <th className="px-4 py-3">Resumen</th>
                <th className="px-4 py-3 align-top">
                  Champion
                  <TextFilter label="champion" value={filters.champion} onChange={(v) => setFilter("champion", v)} />
                </th>
                <th className="px-4 py-3 align-top">
                  Área
                  <SelectFilter
                    label="área"
                    value={filters.area}
                    onChange={(v) => setFilter("area", v)}
                    options={areaOptions.map((a) => ({ value: a, label: a }))}
                  />
                </th>
                <th className="px-4 py-3 align-top">
                  Coach
                  <SelectFilter
                    label="coach"
                    value={filters.coach}
                    onChange={(v) => setFilter("coach", v)}
                    options={Object.entries(COACH_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                </th>
                <th className="px-4 py-3 align-top">
                  Ola
                  <SelectFilter
                    label="ola"
                    value={filters.ola}
                    onChange={(v) => setFilter("ola", v)}
                    options={Object.entries(OLA_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                </th>
                <th className="px-4 py-3 align-top">
                  Etapa
                  <SelectFilter
                    label="etapa"
                    value={filters.etapa}
                    onChange={(v) => setFilter("etapa", v)}
                    options={Object.entries(ETAPA_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                </th>
                <th className="px-4 py-3">Avance</th>
                <th className="px-4 py-3">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted">
                    Ningún caso coincide con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                sorted.map((caso) => (
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
                  <td className="px-4 py-3 text-ink-muted">
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                      {caso.avance_pct}%
                      {caso.avance_pct >= 100 ? <CompletadoBadge compact /> : null}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {caso.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
