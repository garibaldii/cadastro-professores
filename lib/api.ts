// lib/api.ts
import { cookies } from "next/headers";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return res;
}
