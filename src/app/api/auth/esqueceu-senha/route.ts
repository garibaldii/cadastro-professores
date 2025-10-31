import { NextRequest, NextResponse } from "next/server";

function getApiBase(): string {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (!raw) throw new Error("API_URL não configurada no front (.env.local).");
  return raw.replace(/\/+$/, "");
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const res = await fetch(`${getApiBase()}/auth/esqueceu-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { mensagem: "Falha ao contatar o back-end" },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
