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
    toast.info("Gerando relatório de ponto...");
    try {
      // Assumimos últimos 30 dias; pode ser ajustado depois com filtros na UI
      const fim = new Date();
      const inicio = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000); // 30 dias incluindo hoje
      const dataInicio = inicio.toISOString();
      const dataFim = fim.toISOString();

      const res = await fetch(`/api/ponto?limit=500&dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}`, { cache: "no-store" });
      interface PontoApiResponse {
        success?: boolean;
        pontos?: PontoRecord[];
        data?: PontoRecord[]; // alguns endpoints usam 'data'
        mensagem?: string;
        message?: string;
        bruto?: string; // resposta não JSON parcial
      }
      interface PontoRecord {
        id?: string;
        entrada?: string;
        saida?: string | null;
        usuario?: { id?: string; nome?: string; email?: string } | null;
      }
      let body: PontoApiResponse = {};
      try { body = await res.json(); } catch {}
      if (!res.ok) {
        const rawInfo = body?.bruto ? ` (parcial: ${String(body.bruto).slice(0,120)})` : "";
        toast.error((body?.mensagem || body?.message || `Erro ${res.status} ao carregar pontos`) + rawInfo);
        return;
      }
      const pontos: PontoRecord[] = (Array.isArray(body?.pontos) ? body.pontos : Array.isArray(body?.data) ? body.data : []);
      if (!Array.isArray(pontos) || pontos.length === 0) {
        toast.error("Nenhum registro de ponto no período.");
        return;
      }

      // Helpers para formatação igual ao app mobile
      function formatDate(dt?: string | null) {
        if (!dt) return "-";
        const d = new Date(dt);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
      function formatTime(dt?: string | null) {
        if (!dt) return "-";
        const d = new Date(dt);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      }
      function calcHorasTrabalhadas(entrada?: string, saida?: string) {
        if (!entrada || !saida) return "-";
        const dE = new Date(entrada); const dS = new Date(saida);
        if (isNaN(dE.getTime()) || isNaN(dS.getTime()) || dS < dE) return "-";
        const diffMs = dS.getTime() - dE.getTime();
        const totalMin = Math.floor(diffMs / 60000);
        const horas = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        return `${horas}h ${mins}min`;
      }

      // Transformar dados exatamente como o app mobile
      const exportData = pontos.map((p) => ({
        data: formatDate(p.entrada),
        entrada: formatTime(p.entrada),
        saida: p.saida ? formatTime(p.saida) : "Em aberto",
        horasTrabalhadas: calcHorasTrabalhadas(p.entrada, p.saida || undefined),
      }));

      // Calcular total de horas (igual app mobile)
      let totalMinutes = 0;
      pontos.forEach((p) => {
        if (p.entrada && p.saida) {
          const dE = new Date(p.entrada); const dS = new Date(p.saida);
          if (!isNaN(dE.getTime()) && !isNaN(dS.getTime()) && dS > dE) {
            totalMinutes += (dS.getTime() - dE.getTime()) / 60000;
          }
        }
      });
      const totalHoras = Math.floor(totalMinutes / 60);
      const totalMins = Math.floor(totalMinutes % 60);
      const totalHorasStr = `${totalHoras}h ${totalMins}min`;

      // Período (igual app mobile)
      const periodoStr = pontos.length > 0 
        ? `${formatDate(pontos[pontos.length - 1].entrada)} até ${formatDate(pontos[0].entrada)}`
        : "N/A";

      // Buscar info do primeiro monitor (se houver)
      const primeiroUsuario = pontos[0]?.usuario;
      let monitorInfo = undefined;

      if (primeiroUsuario?.id) {
        // Buscar dados completos do monitor via /api/monitores
        try {
          const resMonitores = await fetch("/api/monitores", { cache: "no-store" });
          const bodyMonitores = await resMonitores.json().catch(() => ({}));
          const monitores: Monitor[] = Array.isArray(bodyMonitores) ? bodyMonitores : Array.isArray(bodyMonitores?.data) ? bodyMonitores.data : [];
          
          // Encontrar monitor pelo usuarioId
          const monitorEncontrado = monitores.find(m => m.usuario?.id === primeiroUsuario.id);
          
          if (monitorEncontrado) {
            monitorInfo = {
              nome: monitorEncontrado.nome || "N/A",
              email: monitorEncontrado.email || "N/A",
              projeto: monitorEncontrado.nomePesquisaMonitoria || "N/A",
              professor: monitorEncontrado.professor?.nome || "N/A",
              cargaHoraria: monitorEncontrado.cargaHorariaSemanal?.toString() || "N/A",
            };
          }
        } catch (err) {
          console.warn("Não foi possível carregar dados do monitor:", err);
        }
      }
      
      // Fallback se não conseguiu buscar
      if (!monitorInfo && primeiroUsuario) {
        monitorInfo = {
          nome: primeiroUsuario.nome || "N/A",
          email: primeiroUsuario.email || "N/A",
          projeto: "N/A",
          professor: "N/A",
          cargaHoraria: "N/A",
        };
      }

      const summary = {
        totalRegistros: pontos.length,
        totalHoras: totalHorasStr,
        periodo: periodoStr,
      };

      const selectedColumns = ["data", "entrada", "saida", "horasTrabalhadas"];
      await shareDataToPdfFile(exportData, "ponto", selectedColumns, { monitorInfo, summary });
      toast.success("Relatório de ponto gerado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao gerar relatório de ponto");
    }
  };  return (
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
                              triggerClassName="px-2 sm:px-3 py-1.5 rounded border border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
                            />
                          )}
                          {canValidate && (
                            <>
                              <button
                                className="px-2 sm:px-3 py-1.5 rounded border border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
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
