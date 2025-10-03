"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthErrorProps {
  message?: string;
}

export default function AuthError({
  message = "Sessão expirada. Redirecionando para login...",
}: AuthErrorProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Erro de Autenticação
        </h2>
        <p className="text-gray-600">{message}</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
