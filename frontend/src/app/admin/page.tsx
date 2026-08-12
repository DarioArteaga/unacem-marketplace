import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminCasosTable } from "@/components/admin/AdminCasosTable";
import { fetchAdminCasos, fetchMe } from "@/lib/api/serverAdmin";

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
        <AdminCasosTable casos={data.items} />
      )}
    </div>
  );
}
