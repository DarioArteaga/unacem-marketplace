import { cookies } from "next/headers";
import type {
  AssistSuggestion,
  CasoAdmin,
  CasoWritePayload,
  Paginated,
  UserPublic,
} from "@/lib/api/types";

const COOKIE_NAME = "salto_token";

function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

async function getToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();
  if (!token) {
    throw new Error("No autenticado");
  }
  const response = await fetch(`${backendBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? `Error API ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<{ access_token: string }> {
  const response = await fetch(`${backendBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "No se pudo iniciar sesión");
  }
  return (await response.json()) as { access_token: string };
}

export async function registerRequest(
  email: string,
  password: string,
  nombre: string,
): Promise<UserPublic> {
  const response = await fetch(`${backendBaseUrl()}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password, nombre }),
    cache: "no-store",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "No se pudo registrar");
  }
  return (await response.json()) as UserPublic;
}

export async function fetchMe(): Promise<UserPublic | null> {
  try {
    return await adminFetch<UserPublic>("/api/v1/auth/me");
  } catch {
    return null;
  }
}

export async function fetchAdminCasos(): Promise<Paginated<CasoAdmin>> {
  return adminFetch<Paginated<CasoAdmin>>("/api/v1/admin/casos?page_size=100");
}

export async function fetchAdminCaso(id: string): Promise<CasoAdmin> {
  return adminFetch<CasoAdmin>(`/api/v1/admin/casos/${id}`);
}

export async function createAdminCaso(payload: CasoWritePayload): Promise<CasoAdmin> {
  return adminFetch<CasoAdmin>("/api/v1/admin/casos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCaso(
  id: string,
  payload: Partial<CasoWritePayload>,
): Promise<CasoAdmin> {
  return adminFetch<CasoAdmin>(`/api/v1/admin/casos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCaso(id: string): Promise<void> {
  await adminFetch(`/api/v1/admin/casos/${id}`, { method: "DELETE" });
}

export async function publicarAdminCaso(
  id: string,
  visible_publico: boolean,
): Promise<CasoAdmin> {
  return adminFetch<CasoAdmin>(`/api/v1/admin/casos/${id}/publicar`, {
    method: "POST",
    body: JSON.stringify({ visible_publico }),
  });
}

export async function assistAdmin(texto: string): Promise<AssistSuggestion> {
  return adminFetch<AssistSuggestion>("/api/v1/admin/assist", {
    method: "POST",
    body: JSON.stringify({ texto }),
  });
}

export async function fetchUsers(): Promise<UserPublic[]> {
  return adminFetch<UserPublic[]>("/api/v1/admin/users");
}

export async function updateUserRole(
  id: string,
  role: UserPublic["role"],
): Promise<UserPublic> {
  return adminFetch<UserPublic>(`/api/v1/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function updateUserActive(id: string, is_active: boolean): Promise<UserPublic> {
  return adminFetch<UserPublic>(`/api/v1/admin/users/${id}/activar`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });
}
