import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function getApiBase(): string {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (!raw) throw new Error("API_URL não configurada no front (.env.local).");
  return raw.replace(/\/+$/, "");
}

// Lista registros de ponto com filtros opcionais: dataInicio, dataFim, usuarioId, page, limit
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ mensagem: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams();
  ["page", "limit", "usuarioId", "dataInicio", "dataFim"].forEach((k) => {
    const v = searchParams.get(k);
    if (v) params.set(k, v);
  });

  // Backend monta rotas em '/pontos', não '/ponto'
  const url = `${getApiBase()}/pontos${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });

    // Se status 204 ou corpo vazio, retornar estrutura vazia coerente
    if (res.status === 204) {
      return NextResponse.json({ success: true, pontos: [], total: 0 }, { status: 200 });
    }

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    let parsed: unknown;
    if (contentType.includes("application/json") && text.trim() !== "") {
      try {
        parsed = JSON.parse(text);
  } catch {
        // Retornar texto bruto para inspeção se JSON inválido
        return NextResponse.json(
          { mensagem: "Falha ao parsear JSON", bruto: text },
          { status: 502 }
        );
      }
    } else if (text.trim() === "") {
      parsed = { success: true, pontos: [], total: 0 };
    } else {
      // Conteúdo não JSON: tentar extrair JSON bruto entre chaves
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = { mensagem: "Resposta não JSON", bruto: text.slice(0, 500) };
        }
      } else {
        parsed = { mensagem: "Resposta não JSON", bruto: text.slice(0, 500) };
      }
    }

  return NextResponse.json(parsed as Record<string, unknown>, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { mensagem: "Falha ao contatar o back-end", erro: (err as Error).message },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
