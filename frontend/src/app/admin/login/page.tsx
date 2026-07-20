"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm(): React.ReactElement {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { detail?: string } | null;
      setError(body?.detail ?? "No se pudo iniciar sesión");
      return;
    }
    const next = search.get("next") || "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-ink-muted/10">
      <h1 className="font-serif text-2xl font-semibold text-brand">Ingresar</h1>
      <p className="mt-1 text-sm text-ink-muted">Panel de coaches y administración.</p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-accent disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-muted">
        ¿Sin cuenta?{" "}
        <Link href="/admin/register" className="font-medium text-brand">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage(): React.ReactElement {
  return (
    <Suspense fallback={<p className="text-ink-muted">Cargando…</p>}>
      <LoginForm />
    </Suspense>
  );
}
