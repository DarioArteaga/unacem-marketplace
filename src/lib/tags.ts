const STATUS_TAG_EN_PROCESO = "enproceso";

/** Tags de estado conocidos (madurez del caso en el marketplace). */
export const STATUS_TAGS: readonly string[] = [STATUS_TAG_EN_PROCESO];

export function isStatusTag(tag: string): boolean {
  return STATUS_TAGS.includes(tag);
}

/** Etiqueta legible para UI (el valor en el .md sigue en minúsculas sin espacios). */
export function formatTagLabel(tag: string): string {
  if (tag === STATUS_TAG_EN_PROCESO) {
    return "En proceso";
  }
  return tag;
}

/** Estado primero, luego tags temáticos en orden alfabético. */
export function sortTagsForDisplay(tags: string[]): string[] {
  return [...tags].sort((a, b) => {
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
}
