"use client";

import type { RecursoTextoForm } from "@/lib/admin/casoFormSchema";

type RecursoListEditorProps = {
  label: string;
  description: string;
  items: RecursoTextoForm[];
  onChange: (items: RecursoTextoForm[]) => void;
  addLabel: string;
  emptyHint: string;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-ink-muted/20 bg-surface-muted px-3 py-2 text-sm text-ink";

export function RecursoListEditor({
  label,
  description,
  items,
  onChange,
  addLabel,
  emptyHint,
}: RecursoListEditorProps): React.ReactElement {
  function updateAt(index: number, patch: Partial<RecursoTextoForm>): void {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function move(index: number, delta: number): void {
    const next = index + delta;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const [removed] = copy.splice(index, 1);
    copy.splice(next, 0, removed);
    onChange(copy);
  }

  function removeAt(index: number): void {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem(): void {
    onChange([...items, { titulo: "", contenido: "" }]);
  }

  return (
    <fieldset className="rounded-xl border border-ink-muted/10 p-4">
      <legend className="px-1 text-sm font-semibold text-brand">{label}</legend>
      <p className="mb-3 text-xs text-ink-muted">{description}</p>

      {items.length === 0 ? (
        <p className="mb-3 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-muted">
          {emptyHint}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`recurso-${index}`}
              className="rounded-xl bg-surface-muted/60 p-3 ring-1 ring-ink-muted/10"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-ink-muted">
                  #{index + 1}
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded border border-ink-muted/20 bg-surface px-2 py-1 text-xs text-ink disabled:opacity-40"
                    aria-label={`Subir ${label} ${index + 1}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded border border-ink-muted/20 bg-surface px-2 py-1 text-xs text-ink disabled:opacity-40"
                    aria-label={`Bajar ${label} ${index + 1}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded border border-brand/30 bg-surface px-2 py-1 text-xs text-brand"
                    aria-label={`Quitar ${label} ${index + 1}`}
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <label className="block text-sm">
                <span className="font-medium text-ink">Título</span>
                <input
                  value={item.titulo}
                  onChange={(e) => updateAt(index, { titulo: e.target.value })}
                  className={inputClass}
                  placeholder="Nombre corto para identificarlo"
                  maxLength={255}
                />
              </label>
              <label className="mt-2 block text-sm">
                <span className="font-medium text-ink">Contenido</span>
                <textarea
                  rows={6}
                  value={item.contenido}
                  onChange={(e) => updateAt(index, { contenido: e.target.value })}
                  className={`${inputClass} font-mono text-xs leading-relaxed`}
                  placeholder="Pega aquí el prompt o la skill completa…"
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-3 rounded-lg border border-ink-muted/20 bg-surface px-3 py-2 text-sm font-medium text-ink"
      >
        {addLabel}
      </button>
    </fieldset>
  );
}
