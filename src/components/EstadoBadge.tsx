import { formatEstadoLabel, isEnProceso, type EstadoCaso } from "@/lib/estado";

type EstadoBadgeProps = {
  estado: EstadoCaso;
  interactive?: boolean;
};

function badgeClassName(estado: EstadoCaso, interactive: boolean): string {
  const base = "rounded-full px-2.5 py-1 text-xs font-medium";
  if (isEnProceso(estado)) {
    return `${base} bg-brand text-white${
      interactive
        ? " transition group-hover:bg-brand-accent group-focus-visible:bg-brand-accent"
        : ""
    }`;
  }
  // implementado / publicado: badge visible, estilo neutro (no rojo)
  return `${base} bg-surface-muted text-ink ring-1 ring-ink-muted/25${
    interactive
      ? " transition-colors group-hover:bg-brand/10 group-hover:text-brand group-hover:ring-brand/30 group-focus-visible:bg-brand/10 group-focus-visible:text-brand"
      : ""
  }`;
}

export function EstadoBadge({
  estado,
  interactive = false,
}: EstadoBadgeProps): React.ReactElement {
  return (
    <span className={badgeClassName(estado, interactive)}>{formatEstadoLabel(estado)}</span>
  );
}
