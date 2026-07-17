import { formatEstadoLabel, isEnProceso, type EstadoCaso } from "@/lib/estado";

type EstadoBadgeProps = {
  estado: EstadoCaso;
  interactive?: boolean;
};

export function EstadoBadge({
  estado,
  interactive = false,
}: EstadoBadgeProps): React.ReactElement | null {
  if (!isEnProceso(estado)) {
    return null;
  }

  return (
    <span
      className={`rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white ${
        interactive
          ? "transition group-hover:bg-brand-accent group-focus-visible:bg-brand-accent"
          : ""
      }`}
    >
      {formatEstadoLabel(estado)}
    </span>
  );
}
