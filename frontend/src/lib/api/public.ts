import type { CasoPublic, ChampionSummary, Paginated } from "@/lib/api/types";

function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${backendBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60, ...(init as { next?: { revalidate?: number } })?.next },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? `Error API ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchCasosPublic(params?: {
  tag?: string;
  estado?: string;
  champion?: string;
  page_size?: number;
}): Promise<Paginated<CasoPublic>> {
  const search = new URLSearchParams();
  search.set("page", "1");
  search.set("page_size", String(params?.page_size ?? 100));
  if (params?.tag) search.set("tag", params.tag);
  if (params?.estado) search.set("estado", params.estado);
  if (params?.champion) search.set("champion", params.champion);
  return apiGet<Paginated<CasoPublic>>(`/api/v1/casos?${search.toString()}`);
}

export async function fetchCasoBySlug(slug: string): Promise<CasoPublic | null> {
  const url = `${backendBaseUrl()}/api/v1/casos/${encodeURIComponent(slug)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? `Error API ${response.status}`);
  }
  return (await response.json()) as CasoPublic;
}

export async function fetchChampions(): Promise<ChampionSummary[]> {
  return apiGet<ChampionSummary[]>("/api/v1/champions");
}

export async function fetchTags(): Promise<string[]> {
  return apiGet<string[]>("/api/v1/tags");
}

export async function fetchCasoSlugs(): Promise<string[]> {
  const data = await fetchCasosPublic({ page_size: 100 });
  return data.items.map((item) => item.slug);
}
