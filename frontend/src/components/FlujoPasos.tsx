import type { FlujoPasos as Flujo } from "@/lib/api/types";

type FlujoPasosProps = {
  flujo: Flujo;
};

function Column({
  title,
  items,
}: {
  title: string;
  items: string[];
}): React.ReactElement {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-ink-muted/10 bg-surface p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-brand uppercase">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">[por confirmar]</p>
      ) : (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink"
            >
              {item}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function FlujoPasos({ flujo }: FlujoPasosProps): React.ReactElement {
  const empty =
    flujo.entradas.length === 0 && flujo.pasos.length === 0 && flujo.salidas.length === 0;

  if (empty) {
    return (
      <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
        Flujo aún no documentado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      <Column title="Entradas" items={flujo.entradas} />
      <div
        className="hidden items-center justify-center text-brand lg:flex"
        aria-hidden="true"
      >
        →
      </div>
      <Column title="Pasos" items={flujo.pasos} />
      <div
        className="hidden items-center justify-center text-brand lg:flex"
        aria-hidden="true"
      >
        →
      </div>
      <Column title="Salidas" items={flujo.salidas} />
    </div>
  );
}
