"use client";

type SelectFilterProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const FILTER_BASE_CLASS =
  "mt-1 w-full rounded-md border border-ink-muted/20 bg-white px-2 py-1 text-xs font-normal normal-case text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

/** Select de filtro para usar dentro de un <th>, combinado con el label de la columna. */
export function SelectFilter({ label, value, options, onChange }: SelectFilterProps): React.ReactElement {
  return (
    <select
      aria-label={`Filtrar por ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={FILTER_BASE_CLASS}
    >
      <option value="">Todos</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

type TextFilterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/** Input de texto de filtro para usar dentro de un <th>, combinado con el label de la columna. */
export function TextFilter({ label, value, onChange, placeholder }: TextFilterProps): React.ReactElement {
  return (
    <input
      type="text"
      aria-label={`Filtrar por ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Buscar..."}
      className={FILTER_BASE_CLASS}
    />
  );
}
