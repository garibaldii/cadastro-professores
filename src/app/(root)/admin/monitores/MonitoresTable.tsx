"use client";

import * as React from "react";
import { toast } from "sonner";
import { shareDataToPdfFile } from "@/app/components/PdfBodyLayout";
import MonitorEditSheet from "@/app/components/MonitorEditSheet";

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
  canValidate = false,
  canEdit = false,
}: {
  canValidate?: boolean;
  canEdit?: boolean;
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

  const exportarPDF = async () => {
    if (data.length === 0) return;
    toast.info("Exportando para PDF...");
    // Define colunas que quer exportar
    const selectedColumns = [
      "nome",
      "email",
      "tipo",
      "professor",
      "cargaHorariaSemanal",
      "status"
    ];
    // Prepara os dados para exportação
    const exportData = data.map((m) => ({
      nome: m.nome,
      email: m.email,
      tipo: m.tipo,
      professor: m.professor?.nome ?? "-",
      cargaHorariaSemanal: m.cargaHorariaSemanal ?? "-",
      status: m.usuario?.isActive ? "Ativo" : "Pendente/Inativo"
    }));
    await shareDataToPdfFile(exportData, "monitores", selectedColumns);
    toast.success("PDF gerado com sucesso!");
  };

  return (
    <div className="mt-4">
      {erro && (
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-4 text-sm mb-4">
          {erro}
        </div>
      )}

      {/* Botão de Exportar PDF - disponível para ADMIN e SUPER_ADMIN */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportarPDF}
          disabled={loading || data.length === 0}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Exportar Relatório
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
              {(canValidate || canEdit) && (
                <th className="text-left px-3 sm:px-4 py-3 whitespace-nowrap">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 sm:px-4 py-4" colSpan={(canValidate || canEdit) ? 7 : 6}>
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="px-3 sm:px-4 py-4" colSpan={(canValidate || canEdit) ? 7 : 6}>
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
                    {(canValidate || canEdit) && (
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          {canEdit && (
                            <MonitorEditSheet
                              monitorId={m.id}
                              triggerClassName="px-2 sm:px-3 py-1.5 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
                            />
                          )}
                          {canValidate && (
                            <>
                              <button
                                className="px-2 sm:px-3 py-1.5 rounded border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
                                onClick={() => aprovar(m)}
                                disabled={busy === m.id || ativo || !m.usuario?.id}
                              >
                                {busy === m.id ? "Aprovando..." : "Aprovar"}
                              </button>
                              <button
                                className="px-2 sm:px-3 py-1.5 rounded border border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
                                onClick={() => reprovar(m)}
                                disabled={busy === m.id}
                              >
                                {busy === m.id ? "Removendo..." : "Reprovar"}
                              </button>
                            </>
                          )}
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
