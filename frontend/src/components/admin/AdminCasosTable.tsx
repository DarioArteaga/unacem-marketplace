"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SelectFilter, TextFilter } from "@/components/TableColumnFilter";
import type { CasoAdmin } from "@/lib/api/types";
import { COACH_LABELS, ETAPA_LABELS, OLA_LABELS, formatCoachLabel, formatEtapaLabel, formatOlaLabel } from "@/lib/etapa";

type AdminCasosTableProps = {
  casos: CasoAdmin[];
};

type Filters = {
  titulo: string;
  champion: string;
  coach: string;
  ola: string;
  etapa: string;
  publico: string;
};

const EMPTY_FILTERS: Filters = {
  titulo: "",
  champion: "",
  coach: "",
  ola: "",
  etapa: "",
  publico: "",
};

const PUBLICO_OPTIONS = [
  { value: "publicado", label: "Publicado" },
  { value: "borrador", label: "Borrador" },
];

export function AdminCasosTable({ casos }: AdminCasosTableProps): React.ReactElement {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  function setFilter(key: keyof Filters, value: string): void {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(() => {
    const titulo = filters.titulo.trim().toLowerCase();
    const champion = filters.champion.trim().toLowerCase();
    return casos.filter((caso) => {
      if (titulo && !caso.titulo.toLowerCase().includes(titulo)) return false;
      if (champion && !caso.champion.toLowerCase().includes(champion)) return false;
      if (filters.coach && caso.coach !== filters.coach) return false;
      if (filters.ola && caso.ola !== filters.ola) return false;
      if (filters.etapa && caso.etapa_actual !== filters.etapa) return false;
      if (filters.publico === "publicado" && !caso.visible_publico) return false;
      if (filters.publico === "borrador" && caso.visible_publico) return false;
      return true;
    });
  }, [casos, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-3">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            {filtered.length} de {casos.length} casos
          </p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
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
                  <TextFilter
                    label="título"
                    value={filters.titulo}
                    onChange={(v) => setFilter("titulo", v)}
                  />
                </th>
                <th className="px-4 py-3 align-top">
                  Champion
                  <TextFilter
                    label="champion"
                    value={filters.champion}
                    onChange={(v) => setFilter("champion", v)}
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
                <th className="px-4 py-3 align-top">
                  Público
                  <SelectFilter
                    label="público"
                    value={filters.publico}
                    onChange={(v) => setFilter("publico", v)}
                    options={PUBLICO_OPTIONS}
                  />
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                    Ningún caso coincide con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((caso) => (
                <tr key={caso.id} className="border-b border-ink-muted/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {caso.visible_publico ? (
                      <Link
                        href={`/casos/${caso.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        {caso.titulo}
                      </Link>
                    ) : (
                      <span title="Publica el caso para verlo en el marketplace">{caso.titulo}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{caso.champion}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatCoachLabel(caso.coach)}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatOlaLabel(caso.ola)}</td>
                  <td className="px-4 py-3">
                    {caso.avance_pct}% · {formatEtapaLabel(caso.etapa_actual)}
                  </td>
                  <td className="px-4 py-3">
                    {caso.visible_publico ? (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-ink-muted">
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/casos/${caso.id}`} className="font-medium text-brand hover:text-brand-accent">
                      Editar
                    </Link>
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
