"use client";

import * as React from "react";
import { toast } from "sonner";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  isActive: boolean;
  role?: string;
  roles?: string[];
  monitor?: {
    id: string;
    tipo: "MONITOR" | "PESQUISADOR";
    nomePesquisaMonitoria?: string;
  } | null;
};

export default function UsuariosTable({
  canToggleStatus = false,
}: {
  canToggleStatus?: boolean;
}) {
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Usuario[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "active" | "inactive">("all");

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/usuarios", { cache: "no-store" });
      let body: {
        data?: Usuario[];
        items?: Usuario[];
        usuarios?: Usuario[];
        mensagem?: string;
        message?: string;
      } = {};
      try {
        body = await res.json();
      } catch {}
      
      if (!res.ok) {
        setErro(
          body?.mensagem ||
            body?.message ||
            `Erro ${res.status} ao carregar usuários`
        );
        setData([]);
        return;
      }
      
      const list: Usuario[] = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.items)
        ? body.items
        : Array.isArray(body?.usuarios)
        ? body.usuarios
        : [];
      
      setData(list);
    } catch {
      setErro("Falha ao contatar o servidor.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  React.useEffect(() => {
    const handler = () => fetchList();
    window.addEventListener("usuarios:updated", handler);
    return () => window.removeEventListener("usuarios:updated", handler);
  }, [fetchList]);

  async function toggleStatus(usuario: Usuario) {
    const action = usuario.isActive ? "desativar" : "ativar";
    if (!confirm(`Confirmar ${action} o usuário "${usuario.nome}"?`)) return;

    setBusy(usuario.id);
    try {
      const res = await fetch(`/api/usuarios/${usuario.id}/toggle-status`, {
        method: "PATCH",
      });
      
      let body: { mensagem?: string; message?: string } = {};
      try {
        body = await res.json();
      } catch {}
      
      if (!res.ok) {
        toast.error(
          body?.mensagem || body?.message || `Erro ${res.status} ao alterar status`
        );
        return;
      }
      
      toast.success(`Usuário ${action === "ativar" ? "ativado" : "desativado"} com sucesso.`);
      window.dispatchEvent(new CustomEvent("usuarios:updated"));
    } finally {
      setBusy(null);
    }
  }

  const filteredData = React.useMemo(() => {
    if (filter === "all") return data;
    if (filter === "active") return data.filter((u) => u.isActive);
    if (filter === "inactive") return data.filter((u) => !u.isActive);
    return data;
  }, [data, filter]);



  return (
    <div className="mt-4">
      {erro && (
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-4 text-sm mb-4">
          {erro}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todos ({data.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Ativos ({data.filter((u) => u.isActive).length})
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "inactive"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Inativos ({data.filter((u) => !u.isActive).length})
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 overflow-x-auto shadow-md bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                Nome
              </th>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                E-mail
              </th>
                <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                  Perfil
                </th>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                Status
              </th>
              {canToggleStatus && (
                <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr>
                  <td className="px-3 sm:px-4 py-4" colSpan={canToggleStatus ? 5 : 4}>
                    Carregando...
                  </td>
                </tr>
            ) : filteredData.length === 0 ? (
                <tr>
                  <td className="px-3 sm:px-4 py-4" colSpan={canToggleStatus ? 5 : 4}>
                    Nenhum usuário encontrado
                  </td>
                </tr>
            ) : (
              filteredData.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    {usuario.nome}
                  </td>
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    {usuario.email}
                  </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {(() => {
                        const roles = usuario.roles || (usuario.role ? [usuario.role] : []);
                        const normalized = roles.map((r) => r.toUpperCase());
                        if (normalized.includes("SUPER_ADMIN") || normalized.includes("SUPERADMIN")) {
                          return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">Super Admin</span>;
                        }
                        if (normalized.includes("ADMIN")) {
                          return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Admin</span>;
                        }
                        if (usuario.monitor) {
                          if (usuario.monitor.tipo === "MONITOR") {
                            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Monitor</span>;
                          }
                          if (usuario.monitor.tipo === "PESQUISADOR") {
                            return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">Pesquisador</span>;
                          }
                        }
                        return <span className="text-gray-400">-</span>;
                      })()}
                    </td>
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        usuario.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  {canToggleStatus && (
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <button
                        className={`px-3 py-1.5 rounded border text-xs sm:text-sm font-medium transition-colors ${
                          usuario.isActive
                            ? "border-red-600 text-red-700 hover:bg-red-50"
                            : "border-green-600 text-green-700 hover:bg-green-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => toggleStatus(usuario)}
                        disabled={busy === usuario.id}
                      >
                        {busy === usuario.id 
                          ? (usuario.isActive ? "Desativando..." : "Ativando...")
                          : (usuario.isActive ? "Desativar" : "Ativar")}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
