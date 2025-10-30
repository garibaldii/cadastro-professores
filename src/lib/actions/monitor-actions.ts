"use server";

import { cookies } from "next/headers";
import { getApiBase } from "../api";

type DiaSemana = "SEGUNDA"|"TERCA"|"QUARTA"|"QUINTA"|"SEXTA"|"SABADO"|"DOMINGO";
type NovoHorario = { diaSemana: DiaSemana; horasTrabalho: number; };

export async function saveMonitor(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { ok:false, status:401, message:"Sessão expirada. Faça login novamente." };

  const API_URL = getApiBase();

  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const tipo = (String(formData.get("tipo") || "MONITOR").toUpperCase() === "PESQUISADOR" ? "PESQUISADOR" : "MONITOR") as "MONITOR"|"PESQUISADOR";
  const nomePesquisaMonitoria = String(formData.get("nomePesquisaMonitoria") || "").trim();
  const cargaHorariaSemanal = Number(formData.get("cargaHorariaSemanal") || 0);
  const professorId = String(formData.get("professorId") || "").trim();

  let horarios: NovoHorario[] = [];
  const horariosRaw = formData.get("horarios");
  if (typeof horariosRaw === "string" && horariosRaw.length > 0) {
    const parsed = JSON.parse(horariosRaw) as Array<{ diaSemana: string; horasTrabalho: number | null }>;
    horarios = parsed.map(h => ({ diaSemana: h.diaSemana as DiaSemana, horasTrabalho: Number(h.horasTrabalho || 0) }));
  }

  if (!nome || !email || !professorId) return { ok:false, status:400, message:"Preencha nome, e-mail e professor." };
  if (!Number.isFinite(cargaHorariaSemanal) || cargaHorariaSemanal <= 0) return { ok:false, status:400, message:"Informe uma carga horária semanal válida (> 0)." };
  if (!horarios.length) return { ok:false, status:400, message:"Inclua ao menos um horário de trabalho." };

  const total = horarios.reduce((s,h)=>s+(Number(h.horasTrabalho)||0),0);
  if (total !== cargaHorariaSemanal) return { ok:false, status:400, message:`A soma dos horários (${total}h) deve ser igual à carga semanal (${cargaHorariaSemanal}h).` };
  if (horarios.some(h=>h.horasTrabalho<1||h.horasTrabalho>8)) return { ok:false, status:400, message:"Cada bloco diário deve ter entre 1 e 8 horas." };

  try {
    const res = await fetch(`${API_URL}/monitores`, {
      method:"POST",
      headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      cache:"no-store",
      body: JSON.stringify({ nome, email, tipo, nomePesquisaMonitoria, cargaHorariaSemanal, professorId, horarios }),
    });
    if (!res.ok) {
      let msg = "Erro ao criar monitor.";
      try {
        const body = await res.json();
        msg = body?.mensagem || body?.message || msg;
      } catch {}
      return { ok:false, status:res.status, message:msg };
    }
    const data = await res.json().catch(()=>({}));
    return { ok:true, status:201, data };
  } catch {
    return { ok:false, status:502, message:"Falha de comunicação com o servidor." };
  }
}
