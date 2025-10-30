import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MonitorCreateSheet from "@/app/components/MonitorCreateSheet";
import MonitoresTable from "./MonitoresTable";

type Decoded = { role?: string; roles?: string[] };

function norm(s: string) { return s.toUpperCase().replace(/[\s_\-]/g, ""); }
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
  } catch { return { isAdmin: false, isSuper: false }; }
}

export default async function MonitoresPage() {
  const c = await cookies();
  const token = c.get("token")?.value;
  if (!token) redirect("/login");

  const { isAdmin, isSuper } = await roleFlags();
  if (!isAdmin) redirect("/"); // ADMIN ou SUPER acessam a página

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Monitores</h1>
        {/* Formulário visível para ADMIN e SUPER */}
        <MonitorCreateSheet />
      </div>

      {/* Tabela: ações de Aprovar/Remover só aparecem se isSuper = true */}
      <MonitoresTable canValidate={isSuper} />
    </div>
  );
}
