import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, logout } from "@/lib/actions/index";

const Navbar = async () => {
  const session = await getSession();

  return (
    <header className="px-5 py-3 bg-gray-50 shadow-sm font-work-sans text-gray-800 border-b border-gray-200">
      <nav className="flex justify-between items-center ">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          {session && session.id ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium">
                  Professores
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/professor/cadastro"}>Cadastro</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href={"/professor/relatorio"}>Relatório</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium">
                  Cursos
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/curso/cadastro"}>Cadastro</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href={"/curso/relatorio"}>Relatório</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium">
                  <span>{session.nome}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={`/usuario/${session.id}`}>Meu Perfil</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <form
                      action={async () => {
                        "use server";
                        await logout();
                        redirect("/login");
                      }}
                    >
                      <button type="submit" className="text-red-400">
                        Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // <form action={async () => {
            //     "use server"

            //     await signIn('github')
            // }}>
            //     <button type="submit">Login</button>
            // </form>
            <Link
              href={"/login"}
              className="text-rose-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
