"use client";

import * as React from "react";
import { toast } from "sonner";

type Monitor = {
  id: string;
  nome: string;
  email: string;
  tipo: "MONITOR" | "PESQUISADOR";
  nomePesquisaMonitoria?: string | null;
  cargaHorariaSemanal?: number | null;
  professor?: { id: string; nome: string } | null;
  usuario?: { id?: string; isActive?: boolean } | null;
};

export default function MonitoresTable({
  canValidate = true,
}: {
  canValidate?: boolean;
}) {
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Monitor[]>([]);
  const [busy, setBusy] = React.useState<string | null>(null);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/monitores", { cache: "no-store" });
      let body: {
        data?: Monitor[];
        items?: Monitor[];
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
            `Erro ${res.status} ao carregar monitores`
        );
        setData([]);
        return;
      }
      const list: Monitor[] = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.items)
        ? body.items
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
    window.addEventListener("monitores:updated", handler);
    return () => window.removeEventListener("monitores:updated", handler);
  }, [fetchList]);

  async function aprovar(m: Monitor) {
    if (!m.usuario?.id) {
      toast.error("Usuário vinculado não encontrado.");
      return;
    }
    setBusy(m.id);
    try {
      const res = await fetch(`/api/usuarios/${m.usuario.id}/toggle-status`, {
        method: "PATCH",
      });
      let body: { mensagem?: string; message?: string } = {};
      try {
        body = await res.json();
      } catch {}
      if (!res.ok) {
        toast.error(
          body?.mensagem || body?.message || `Erro ${res.status} ao aprovar`
        );
        return;
      }
      toast.success("Monitor aprovado (status do usuário atualizado).");
      window.dispatchEvent(new CustomEvent("monitores:updated"));
    } finally {
      setBusy(null);
    }
  }

  async function reprovar(m: Monitor) {
    if (!confirm(`Confirmar reprovação e exclusão do monitor "${m.nome}"?`))
      return;
    setBusy(m.id);
    try {
      const res = await fetch(`/api/monitores/${m.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        let body: { mensagem?: string; message?: string } = {};
        try {
          body = await res.json();
        } catch {}
        toast.error(
          body?.mensagem || body?.message || `Erro ${res.status} ao reprovar`
        );
        return;
      }
      toast.success("Monitor reprovado e removido.");
      window.dispatchEvent(new CustomEvent("monitores:updated"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-4">
      {erro && (
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-4 text-sm mb-4">
          {erro}
        </div>
      )}

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
                Tipo
              </th>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                Professor
              </th>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                CH Semanal
              </th>
              <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                Status
              </th>
              {canValidate && (
                <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 sm:px-4 py-4" colSpan={canValidate ? 7 : 6}>
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="px-3 sm:px-4 py-4" colSpan={canValidate ? 7 : 6}>
                  Nenhum monitor encontrado
                </td>
              </tr>
            ) : (
              data.map((m) => {
                const ativo = !!m.usuario?.isActive;
                return (
                  <tr
                    key={m.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {m.nome}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {m.email}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {m.tipo}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {m.professor?.nome ?? "-"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-center">
                      {m.cargaHorariaSemanal ?? "-"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {ativo ? "Ativo" : "Pendente/Inativo"}
                    </td>
                    {canValidate && (
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <button
                            className="px-2 sm:px-3 py-1.5 rounded border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
                            onClick={() => aprovar(m)}
                            disabled={busy === m.id || ativo || !m.usuario?.id}
                          >
                            Aprovar
                          </button>
                          <button
                            className="px-2 sm:px-3 py-1.5 rounded border border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
                            onClick={() => reprovar(m)}
                            disabled={busy === m.id}
                          >
                            Reprovar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
