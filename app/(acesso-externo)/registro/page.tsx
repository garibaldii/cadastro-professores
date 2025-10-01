"use client";

import React, { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import Image from "next/image";
import { Mail } from "lucide-react";
import { LockIcon } from "lucide-react";
import { LetterText } from "lucide-react";
import { XCircle } from "lucide-react";

import Link from "next/link";
import { saveUser } from "@/lib/actions";
import z from "zod";
import { createUserSchema } from "@/lib/validation";


const Registro = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        senha: formData.get("senha") as string,
      };

      await createUserSchema.parseAsync(formValues);

      const result = await saveUser(formData);

      if (result.error) {
        toast.error(result.error);
        return result;
      }

      toast.success("Conta criada com sucesso! ✅", {
        description: "Direcionando para a tela de Login",
        position: 'top-center'
      });

      return result;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
      } else {
        toast.error("Erro inesperado", {
          description: error.message || "Erro inesperado do servidor",
          dismissible: true,
        });
      }
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
        <span>Já possui uma conta?</span>
        <Link href={"/login"} className=" ml-2 underline text-blue-500">
          Faça o Login.
        </Link>
      </div>

      <div>
        <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
          <LetterText size={20} className="text-gray-500" />
          <Input
            id="nome"
            name="nome"
            placeholder="Digite seu nome"
            required
            className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
          />
        </div>
        {errors.nome && <p className="startup-form_error">{errors.nome}</p>}
      </div>

      <div>
        <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
          <Mail size={20} className="text-gray-500" />
          <Input
            id="email"
            name="email"
            placeholder="Endereço de Email"
            required
            className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
          />
        </div>
        {errors.email && <p className="startup-form_error">{errors.email}</p>}
      </div>

      <div>
        <div className="flex items-center border-2 rounded-xl px-3 py-2 gap-2">
          <LockIcon className="text-gray-500" />
          <Input
            id="senha"
            name="senha"
            placeholder="Senha"
            type="password"
            required
            className="!border-0 !ring-0 !outline-none !shadow-none flex-1 bg-transparent"
          />
        </div>
        {errors.senha && <p className="startup-form_error">{errors.senha}</p>}
      </div>

      <Button type="submit" className="w-full mb-3">
        {isLoading ? "Cadastrando..." : "Cadastrar "}
      </Button>
    </form>
  );
};

export default Registro;
