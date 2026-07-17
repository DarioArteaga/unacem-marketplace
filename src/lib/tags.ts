import type { Caso } from "@/lib/schema";
import { resolveEstado } from "@/lib/estado";

const LEGACY_STATUS_TAG = "enproceso";

/** Tags temáticos para chips (excluye el tag de estado legado). */
export function getThematicTags(casos: Caso[]): string[] {
  const tags = new Set<string>();
  for (const caso of casos) {
    for (const tag of caso.tags) {
      if (tag !== LEGACY_STATUS_TAG) {
        tags.add(tag);
      }
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b, "es"));
}

/** Chips de filtro: "enproceso" primero si hay casos en ese estado, luego tags. */
export function getFilterChips(casos: Caso[]): string[] {
  const thematic = getThematicTags(casos);
  const hasEnProceso = casos.some(
    (caso) => resolveEstado(caso.estado, caso.tags) === "enproceso",
  );
  return hasEnProceso ? [LEGACY_STATUS_TAG, ...thematic] : thematic;
}

export function formatFilterLabel(chip: string): string {
  if (chip === LEGACY_STATUS_TAG) {
    return "En proceso";
  }
  return chip;
}

export function isEstadoFilterChip(chip: string): boolean {
  return chip === LEGACY_STATUS_TAG;
}

export function sortTagsForDisplay(tags: string[]): string[] {
  return [...tags]
    .filter((tag) => tag !== LEGACY_STATUS_TAG)
    .sort((a, b) => a.localeCompare(b, "es"));
}
