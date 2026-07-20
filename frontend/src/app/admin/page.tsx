import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchAdminCasos, fetchMe } from "@/lib/api/serverAdmin";
import { formatEtapaLabel } from "@/lib/etapa";

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
  const user = await fetchMe();
  if (!user) {
    redirect("/admin/login");
  }
  if (user.role === "viewer") {
    return (
      <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink-muted/10">
        <h1 className="font-serif text-2xl font-semibold text-brand">Sin permisos aún</h1>
        <p className="mt-2 text-ink-muted">
          Tu cuenta está como <strong>viewer</strong>. Pide a un super_admin que te asigne el rol
          de coach para crear y editar casos.
        </p>
      </div>
    );
  }

  const data = await fetchAdminCasos();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand">Casos</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {user.role === "super_admin" ? "Todos los casos" : "Tus casos"} · {data.meta.total}
          </p>
        </div>
        <Link
          href="/admin/casos/nuevo"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-accent"
        >
          Nuevo caso
        </Link>
      </div>

      {data.items.length === 0 ? (
        <p className="rounded-xl bg-surface px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
          Aún no hay casos. Crea el primero.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-ink-muted/10">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-muted/10 text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Champion</th>
                <th className="px-4 py-3">Etapa</th>
                <th className="px-4 py-3">Público</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((caso) => (
                <tr key={caso.id} className="border-b border-ink-muted/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{caso.titulo}</td>
                  <td className="px-4 py-3 text-ink-muted">{caso.champion}</td>
                  <td className="px-4 py-3">
                    {caso.avance_pct}% · {formatEtapaLabel(caso.etapa_actual)}
                  </td>
                  <td className="px-4 py-3">
                    {caso.visible_publico ? (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-ink-muted">
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/casos/${caso.id}`}
                      className="font-medium text-brand hover:text-brand-accent"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
