'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail } from "lucide-react";
import { LockIcon } from "lucide-react";

import Link from "next/link";
import React, { useActionState } from "react";
import { login } from "@/lib/actions";

import { useRouter } from "next/navigation";
import { toast } from "sonner";





const Login = () => {

  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        email: formData.get("email") as string,
        senha: formData.get("senha") as string,
      };

      console.log(formValues);

      const result = await login(formData)

      console.log(result.data);

      router.push("/")

      return result;
    } catch (error: any) {

      toast("Erro ao efetuar login", {
        description: error
      })

      console.log(error)
    }
  };

  const [state, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form className="cadastro-form !p-10 rounded-lg  w-1/3" action={formAction}>
      <header className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={150} height={30} />
      </header>

      <hr />

      <div className="flex justify-center">
        <span>Não tem uma conta?</span>
        <Link
          href={"/registro"}
          className=" ml-2 underline text-blue-500"
        >
          Faça o cadastro.
        </Link>
      </div>

      <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
        <Mail size={20} className="text-gray-500" />
        <Input
          id="email"
          name="email"
          placeholder="Endereço de Email"
          className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
        />
      </div>

      <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
        <LockIcon className="text-gray-500" />
        <Input
          id="senha"
          name="senha"
          placeholder="Senha"
          type="password"
          className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
        />
      </div>

      <Button type="submit" className="w-full mb-3">
        {isLoading ? "Entrando..." : "Login"}
      </Button>

      <div className="flex justify-center">
        <Link
          href={"/usuario/esqueceu-senha"}
          className=" underline text-blue-500"
        >
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
};

export default Login;
