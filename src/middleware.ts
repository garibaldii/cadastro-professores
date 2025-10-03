import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  userName: string;
  email: string;
  exp: number;
}

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/registro',
  '/esqueceu-senha',
  '/api/auth',
];

// Rotas que precisam de autenticação (para referência/documentação)
// const protectedRoutes = [
//   '/professor',
//   '/curso', 
//   '/usuario',
//   '/', // página inicial também precisa de auth
// ];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  // Se não é uma rota pública e não é um arquivo estático
  return !isPublicRoute(pathname) && 
         !pathname.startsWith('/_next') && 
         !pathname.startsWith('/favicon.ico') &&
         !pathname.startsWith('/logo.png') &&
         !pathname.includes('.');
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Verifica se o token não expirou
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Se está tentando acessar uma rota protegida
  if (isProtectedRoute(pathname)) {
    // Se não tem token ou token é inválido, redireciona para login
    if (!token || !isTokenValid(token)) {
      const loginUrl = new URL('/login', request.url);
      // Adiciona a URL de destino como parâmetro para redirecionamento após login
      loginUrl.searchParams.set('redirect', pathname);
      
      // Cria resposta de redirecionamento
      const response = NextResponse.redirect(loginUrl);
      
      // Define cookie com mensagem de erro para exibir toast
      let errorMessage = 'Você precisa fazer login para acessar esta página.';
      
      if (token && !isTokenValid(token)) {
        errorMessage = 'Sua sessão expirou. Faça login novamente.';
      }
      
      // Personaliza a mensagem baseada na rota acessada
      if (pathname.startsWith('/professor')) {
        errorMessage += ' Área de professores requer autenticação.';
      } else if (pathname.startsWith('/curso')) {
        errorMessage += ' Área de cursos requer autenticação.';
      }
      
      response.cookies.set('auth-error', errorMessage, {
        httpOnly: false,
        maxAge: 60,
        path: '/',
        sameSite: 'lax'
      });
      
      return response;
    }
  }

  // Se está autenticado e tentando acessar página de login/registro
  if (isPublicRoute(pathname) && token && isTokenValid(token)) {
    // Se tem parâmetro redirect, usa ele; senão vai para página inicial
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};