import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail } from "lucide-react";
import { LockIcon } from "lucide-react";

import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <form className="cadastro-form !p-10 rounded-lg ">
      <header className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={150} height={30} />
      </header>

      <hr />

      <div className="flex">
        <span>Não tem uma conta?</span>
        <Link
          href={"/usuario/registro"}
          className=" ml-2 underline text-blue-500"
        >
          Faça o registro
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
        Login
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
