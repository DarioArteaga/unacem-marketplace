"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminRegisterPage(): React.ReactElement {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/session/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { detail?: string } | null;
      setError(body?.detail ?? "No se pudo registrar");
      return;
    }
    setOk(true);
    setTimeout(() => router.push("/admin/login"), 1200);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ink-muted/10">
      <h1 className="font-serif text-2xl font-semibold text-brand">Crear cuenta</h1>
      <p className="mt-1 text-sm text-ink-muted">
        El registro crea un perfil <strong>viewer</strong>. Un super_admin te promoverá a coach.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-ink">Nombre</span>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-muted/20 bg-surface-muted px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-muted/20 bg-surface-muted px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-muted/20 bg-surface-muted px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        {ok ? <p className="text-sm text-ink">Cuenta creada. Redirigiendo al login…</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent disabled:opacity-60"
        >
          {loading ? "Creando…" : "Registrarme"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/admin/login" className="font-medium text-brand">
          Ingresar
        </Link>
      </p>
    </div>
  );
}
