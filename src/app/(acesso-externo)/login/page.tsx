"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail } from "lucide-react";
import { LockIcon } from "lucide-react";

import Link from "next/link";
import React, { Suspense, useActionState } from "react";
import { login } from "@/lib/actions/index";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthError } from "@/hooks/useAuthError";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hook para exibir erros de autenticação via toast
  useAuthError();

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const result = await login(formData);

      if (result.status === "ERROR") {
        toast.error("Erro ao efetuar login", {
          description: result.error,
        });
        return result;
      }

      toast.success("Login realizado com sucesso!", {
        description: "Redirecionando...",
        position: "top-center",
      });

      // Redirecionar para a página que o usuário estava tentando acessar
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Erro ao efetuar login", {
        description: errorMessage,
      });
      return { error: errorMessage, status: "ERROR" as const };
    }
  };

  const [, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "ERROR" as const,
  });

  return (
    <form
      className="cadastro-form !p-10 rounded-lg w-full max-w-md mx-4"
      action={formAction}
    >
      <header className="flex justify-center mb-2">
        <Image src="/logo.png" alt="logo" width={150} height={30} />
      </header>

      <hr className="my-4" />

      <div className="flex justify-center text-sm mb-6">
        <span>Não tem uma conta?</span>
        <Link
          href={"/registro"}
          className="ml-2 underline text-blue-500 font-medium"
        >
          Faça o cadastro.
        </Link>
      </div>

      <div className="flex items-center border-2 rounded-xl px-4 py-3 gap-2 hover:border-gray-400 transition-colors">
        <Mail size={20} className="text-gray-500" />
        <Input
          id="email"
          name="email"
          placeholder="Endereço de Email"
          className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
        />
      </div>

      <div className="flex items-center border-2 rounded-xl px-4 py-3 gap-2 hover:border-gray-400 transition-colors">
        <LockIcon className="text-gray-500" />
        <Input
          id="senha"
          name="senha"
          placeholder="Senha"
          type="password"
          className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
        />
      </div>

      <Button type="submit" className="w-full mb-3 py-6">
        {isLoading ? "Entrando..." : "Login"}
      </Button>

      <div className="flex justify-center text-sm">
        <Link
          href={"/usuario/esqueceu-senha"}
          className="underline text-blue-500 font-medium"
        >
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}

const Login = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
