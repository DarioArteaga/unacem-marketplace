import Link from "next/link";

export function AprendizajePanel(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 id="casos-heading" className="font-serif text-2xl font-semibold text-brand">
          Aprendizaje · Ruta del Champion
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Material asíncrono para champions que pasan a acompañar a otros. Requiere iniciar sesión.
        </p>
      </div>

      <article className="rounded-2xl border border-ink-muted/15 bg-surface p-6 shadow-sm">
        <p className="text-[10px] font-medium tracking-wide text-brand uppercase">Módulo 9 · ~1h45–2h15</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-brand">Pedagogía para entornos digitales</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Bases antes de las sesiones en vivo (M10 y M11): pasar de usar IA a acompañar a un coachee, marco M-R-O-C,
          qué tarea atacar primero, Copilot vs Claude Teams, resistencia y escalada. El progreso (bloques, quizzes,
          matriz y reflexiones) se guarda en tu cuenta.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink">
          <li>De usuario a coach</li>
          <li>El marco de la conversación</li>
          <li>Qué tarea atacar primero</li>
          <li>Copilot vs. Claude Teams</li>
          <li>Resistencia y escalada</li>
        </ul>
        <Link
          href="/aprendizaje/modulo-9"
          className="mt-6 inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent"
        >
          Abrir módulo 9
        </Link>
      </article>
    </div>
  );
}
