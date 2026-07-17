import Link from "next/link";

export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-brand">Página no encontrada</h1>
      <p className="mt-3 text-ink-muted">
        El caso o la página que buscas no existe o ya no está disponible.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white outline-none transition hover:bg-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
