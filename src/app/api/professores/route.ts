import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const BASE = getApiBase();
  const url = `${BASE}/professores`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    let body: unknown = {};
    try {
      body = await res.json();
    } catch {}
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Falha ao contatar o back-end" },
      { status: 502 }
    );
  }
}
