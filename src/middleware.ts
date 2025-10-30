import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId?: string;
  userName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
}

const publicRoutes = ["/login", "/registro", "/esqueceu-senha", "/api/auth"];

// Rotas que precisam de autenticação (para referência/documentação)
// const protectedRoutes = [
//   '/professor',
//   '/curso',
//   '/usuario',
//   '/', // página inicial também precisa de auth
// ];

const adminRoutes = ["/admin"];

function norm(s: string): string {
  return s.toUpperCase().replace(/[\s_\-]/g, "");
}

// Papéis válidos
const SA = new Set(["SUPERADMIN", "SUPERADM", "SUPERADMINISTRATOR"]);
const ADMIN = new Set(["ADMIN", "ADM", ...SA]);

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return (
    !isPublicRoute(pathname) &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/favicon.ico") &&
    !pathname.startsWith("/logo.png") &&
    !pathname.includes(".")
  );
}

function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  return !!decoded?.exp && decoded.exp > Date.now() / 1000;
}

function hasAnyRole(decoded: DecodedToken | null, roles: Set<string>): boolean {
  if (!decoded) return false;
  const raw = decoded.roles ?? (decoded.role ? [decoded.role] : []);
  return raw.map(norm).some((r) => roles.has(r));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value ?? null;
  const decoded = token ? decodeToken(token) : null;

  // ⚠️ Se já estiver logado e tentar acessar rota pública (login/registro)
  if (isPublicRoute(pathname) && token && isTokenValid(token)) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // 🔒 Controle de acesso
  if (isProtectedRoute(pathname)) {
    if (!token || !isTokenValid(token)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      const expired = token && !isTokenValid(token);

      const errorMessage = expired
        ? "Sua sessão expirou. Faça login novamente."
        : "Você precisa fazer login para acessar esta página.";

      response.cookies.set("auth-error", errorMessage, {
        httpOnly: false,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
      });

      return response;
    }

    // 🔐 Bloqueia acesso a /admin para não-admins
    if (adminRoutes.some((r) => pathname.startsWith(r)) && !hasAnyRole(decoded, ADMIN)) {
      const home = new URL("/", request.url);
      const response = NextResponse.redirect(home);
      response.cookies.set("auth-error", "Acesso restrito a administradores.", {
        httpOnly: false,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
      });
      return response;
    }
  }

  // ✅ Caso contrário, segue o fluxo normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
