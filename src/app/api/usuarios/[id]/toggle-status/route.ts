import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function getApiBase(): string {
  const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (!raw) throw new Error("API_URL não configurada no front (.env.local).");
  return raw.replace(/\/+$/, "");
}

function norm(s: string): string {
  return s.toUpperCase().replace(/[\s_\-]/g, "");
}

const SUPERADM_ROLES = new Set(["SUPERADMIN", "SUPERADM", "SUPERADMINISTRATOR"]);

interface DecodedToken {
  role?: string;
  roles?: string[];
  exp?: number;
}

interface JsonResponse {
  message?: string;
  mensagem?: string;
  [key: string]: unknown;
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

function isSuper(decoded: DecodedToken | null): boolean {
  if (!decoded) return false;
  const roles = decoded.roles ?? (decoded.role ? [decoded.role] : []);
  return roles.map(norm).some((r) => SUPERADM_ROLES.has(r));
}

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = decodeJwt(token);
  if (!isSuper(decoded)) {
    return NextResponse.json({ message: "Forbidden - Super Admin required" }, { status: 403 });
  }

  const url = `${getApiBase()}/usuarios/${params.id}/toggle-status`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ 
        message: `Erro ${res.status} ao alterar status do usuário` 
      })) as JsonResponse;
      return NextResponse.json(body, { status: res.status });
    }

    const body = await res.json().catch(() => ({ 
      message: "Status alterado com sucesso" 
    })) as JsonResponse;
    
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Falha ao contatar o servidor" }, 
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
