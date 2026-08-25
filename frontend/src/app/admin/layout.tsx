import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { fetchMe } from "@/lib/api/serverAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const user = await fetchMe();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-ink-muted/10 bg-ink text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif text-lg font-semibold">
              Admin · Proyecto Salto
            </Link>
            {user ? (
              <nav className="flex flex-wrap gap-3 text-sm text-white/80">
                <Link href="/admin" className="hover:text-white">
                  Casos
                </Link>
                <Link href="/aprendizaje/modulo-9" className="hover:text-white">
                  Módulo 9
                </Link>
                {(user.role === "coach" || user.role === "super_admin") && (
                  <Link href="/admin/casos/nuevo" className="hover:text-white">
                    Nuevo caso
                  </Link>
                )}
                {user.role === "super_admin" ? (
                  <Link href="/admin/usuarios" className="hover:text-white">
                    Usuarios
                  </Link>
                ) : null}
                <Link href="/" className="hover:text-white">
                  Ver sitio
                </Link>
              </nav>
            ) : null}
          </div>
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/70">
                {user.nombre} · {user.role}
              </span>
              <LogoutButton />
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
