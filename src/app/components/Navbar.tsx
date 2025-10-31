import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession, logout } from "@/lib/actions/index";
import SubmitLogoutButton from "@/app/components/SubmitLogoutButton";

// --- adição mínima: helpers de papel ---
function norm(s: string): string {
  return s.toUpperCase().replace(/[\s_\-]/g, "");
}
const SA = new Set(["SUPERADMIN", "SUPERADM", "SUPERADMINISTRATOR"]);
const ADMIN = new Set(["ADMIN", "ADM", ...SA]);

// Flags de papel via token (robusto contra sessão sem roles)
async function getRoleFlagsFromToken() {
  const c = await cookies();
  const token = c.get("token")?.value;
  if (!token) return { isAdmin: false, isSuper: false };
  try {
    const d = jwtDecode<{ role?: string; roles?: string[] }>(token);
    const raw = d.roles ?? (d.role ? [d.role] : []);
    const N = raw.map(norm);
    const isSuper = N.some((r) => SA.has(r));
    const isAdmin = isSuper || N.some((r) => ADMIN.has(r));
    return { isAdmin, isSuper };
  } catch {
    return { isAdmin: false, isSuper: false };
  }
}
// --- fim da adição mínima ---

const Navbar = async () => {
  const session = await getSession();
  const { isAdmin, isSuper } = await getRoleFlagsFromToken();
  const canSeeMonitores = isAdmin;
  const canSeeUsuarios = isSuper;

  return (
    <header className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 bg-gray-50 shadow-md font-work-sans text-gray-800 border-b border-gray-200">
      <nav className="flex justify-between items-center max-w-[1400px] mx-auto">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={144}
            height={30}
            className="w-32 sm:w-36"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
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

              {/* Usuários — aparece APENAS para SUPER_ADMIN */}
              {canSeeUsuarios && (
                <Link
                  href="/admin/usuarios"
                  className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium"
                >
                  Usuários
                </Link>
              )}

              {/* Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-black-400 hover:text-rose-500 cursor-pointer transition-colors duration-200 font-medium">
                  <span>{session.nome}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <form
                    action={async () => {
                      "use server";
                      await logout();
                      redirect("/login");
                    }}
                  >
                    <DropdownMenuItem asChild>
                      <SubmitLogoutButton className="text-red-500 w-full text-left" />
                    </DropdownMenuItem>
                  </form>
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
