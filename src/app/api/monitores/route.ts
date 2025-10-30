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
const ADMIN_ROLES = new Set(["ADMIN", "ADM", ...SUPERADM_ROLES]);

interface DecodedToken {
  role?: string;
  roles?: string[];
  exp?: number;
}

interface JsonResponse {
  message?: string;
  [key: string]: unknown;
}

type ApiResponseBody = JsonResponse | JsonResponse[];

function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

function isAdminOrSuper(decoded: DecodedToken | null): boolean {
  if (!decoded) return false;
  const roles = decoded.roles ?? (decoded.role ? [decoded.role] : []);
  return roles.map(norm).some((r) => ADMIN_ROLES.has(r));
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = decodeJwt(token);
  if (!isAdminOrSuper(decoded)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const url = `${getApiBase()}/monitores`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 204) return NextResponse.json([], { status: 200 });

    const body = (await res.json().catch(() => ({ message: "Empty or invalid JSON" }))) as ApiResponseBody;
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Falha ao contatar o back-end" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = decodeJwt(token);
  if (!isAdminOrSuper(decoded)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const url = `${getApiBase()}/monitores`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => ({ message: "Empty or invalid JSON" }))) as ApiResponseBody;
  return NextResponse.json(body, { status: res.status });
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
