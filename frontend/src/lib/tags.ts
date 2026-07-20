const LEGACY_STATUS_TAG = "enproceso";

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
