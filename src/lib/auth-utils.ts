import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  userName: string;
  email: string;
  exp?: number;
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // Verifica se o token não expirou
    return !decoded.exp || decoded.exp > currentTime;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
}

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("token=")
  );

  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.split("=")[1];
}

export function clearAuthCookie(): void {
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
}
