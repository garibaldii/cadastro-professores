import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import UsuariosTable from "./UsuariosTable";

type Decoded = { role?: string; roles?: string[] };

function norm(s: string) {
  return s.toUpperCase().replace(/[\s_\-]/g, "");
}

const SA = new Set(["SUPERADMIN", "SUPERADM", "SUPERADMINISTRATOR"]);
const ADMIN = new Set(["ADMIN", "ADM", ...SA]);

async function roleFlags() {
  const c = await cookies();
  const token = c.get("token")?.value;
  if (!token) return { isAdmin: false, isSuper: false };

  try {
    const d = jwtDecode<Decoded>(token);
    const raw = d.roles ?? (d.role ? [d.role] : []);
    const N = raw.map(norm);
    const isSuper = N.some((r) => SA.has(r));
    const isAdmin = isSuper || N.some((r) => ADMIN.has(r));
    return { isAdmin, isSuper };
  } catch {
    return { isAdmin: false, isSuper: false };
  }
}

export default async function UsuariosPage() {
  const c = await cookies();
  const token = c.get("token")?.value;
  if (!token) redirect("/login");

  const { isSuper } = await roleFlags();
  if (!isSuper) redirect("/"); // Apenas SUPER_ADMIN pode acessar usuários

  return (
    <div className="table-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Usuários
        </h1>
      </div>

      {/* Tabela com ações de ativar/desativar (somente para SUPER_ADMIN) */}
      <UsuariosTable canToggleStatus={isSuper} />
    </div>
  );
}
