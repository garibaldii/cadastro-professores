import { cookies } from "next/headers";

function normalizeBase(raw?: string | null): string | null {
  if (!raw) return null;
  try { return new URL(raw).toString().replace(/\/+$/, ""); } catch { return null; }
}

export function getApiBase(): string {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  const base = normalizeBase(raw);
  if (!base) {
    throw new Error("API base não configurada. Defina API_URL em .env.local (ex.: http://localhost:3000).");
  }
  return base;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = new Headers(init.headers || {});
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers, cache: init.cache ?? "no-store" });
}
