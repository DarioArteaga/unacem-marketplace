"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserPublic } from "@/lib/api/types";

type UsersAdminProps = {
  users: UserPublic[];
};

async function proxy<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch("/api/admin/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { detail?: string })
    | { detail?: string }
    | null;
  if (!response.ok) {
    throw new Error(
      data && typeof data === "object" && "detail" in data && data.detail
        ? String(data.detail)
        : `Error ${response.status}`,
    );
  }
  return data as T;
}

export function UsersAdmin({ users }: UsersAdminProps): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function changeRole(id: string, role: UserPublic["role"]): Promise<void> {
    setBusyId(id);
    setError(null);
    try {
      await proxy(`/api/v1/admin/users/${id}/role`, "PATCH", { role });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar rol");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(user: UserPublic): Promise<void> {
    setBusyId(user.id);
    setError(null);
    try {
      await proxy(`/api/v1/admin/users/${user.id}/activar`, "PATCH", {
        is_active: !user.is_active,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al activar/desactivar");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand">Usuarios</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Asigna roles: viewer → coach, o super_admin.
        </p>
      </div>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl bg-surface ring-1 ring-ink-muted/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-muted/10 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Activo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-ink-muted/5 last:border-0">
                <td className="px-4 py-3 font-medium">{user.nombre}</td>
                <td className="px-4 py-3 text-ink-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    disabled={busyId === user.id}
                    value={user.role}
                    onChange={(e) =>
                      void changeRole(user.id, e.target.value as UserPublic["role"])
                    }
                    className="rounded-md border border-ink-muted/20 bg-surface-muted px-2 py-1"
                  >
                    <option value="viewer">viewer</option>
                    <option value="coach">coach</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={busyId === user.id}
                    onClick={() => void toggleActive(user)}
                    className="rounded-md border border-ink-muted/20 px-2 py-1 text-xs"
                  >
                    {user.is_active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
