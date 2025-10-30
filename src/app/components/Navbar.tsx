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

// --- adição mínima: helpers de papel ---
function norm(s: string): string {
  return s.toUpperCase().replace(/[\s_\-]/g, "");
}
const SA = new Set(["SUPERADMIN", "SUPERADM", "SUPERADMINISTRATOR"]);
const ADMIN = new Set(["ADMIN", "ADM", ...SA]);

function isAdminOrSuper(session: {
  role?: string;
  roles?: string[];
} | null): boolean {
  if (!session) return false;
  const raw = [
    ...(Array.isArray(session.roles) ? session.roles : []),
    ...(session.role ? [session.role] : []),
  ];
  return raw.map(norm).some((r) => ADMIN.has(r));
}
// --- fim da adição mínima ---

const Navbar = async () => {
  const session = await getSession();
  const canSeeMonitores = isAdminOrSuper(session);

  return (
    <header className="px-5 py-3 bg-gray-50 shadow-sm font-work-sans text-gray-800 border-b border-gray-200">
      <nav className="flex justify-between items-center ">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          {session && session.id ? (
            <>
              {/* Professores */}
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

              {/* Cursos */}
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

              {/* Monitores — NOVO: aparece para ADMIN e SUPER_ADMIN */}
              {canSeeMonitores && (
                <Link
                  href="/admin/monitores"
                  className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium"
                >
                  Monitores
                </Link>
              )}

              {/* Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium">
                  <span>{session.nome}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
