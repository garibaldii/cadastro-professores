"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { buscarMonitor, updateMonitor } from "@/lib/actions/monitor-actions";

type DiaSemana =
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO"
  | "DOMINGO";
const DIAS: DiaSemana[] = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

type Professor = { id: string; nome: string };
type ServerHorario = {
  diaSemana?: DiaSemana;
  dia_semana?: DiaSemana;
  horasTrabalho?: number | null;
  horas_trabalho?: number | null;
};
type MonitorDetail = {
  id?: string;
  nome?: string;
  email?: string;
  tipo?: "MONITOR" | "PESQUISADOR" | string;
  nomePesquisaMonitoria?: string;
  nome_pesquisa_monitoria?: string;
  cargaHorariaSemanal?: number;
  carga_horaria_semanal?: number;
  professorId?: string;
  professor_id?: string;
  professor?: { id?: string } | null;
  horarios?: ServerHorario[];
};

type FormState = {
  nome: string;
  email: string;
  tipo: "MONITOR" | "PESQUISADOR";
  nomePesquisaMonitoria: string;
  cargaHorariaSemanal: number;
  professorId: string;
  horarios: Array<{ diaSemana: DiaSemana; horasTrabalho: number }>;
};

const initialHorarios: FormState["horarios"] = DIAS.map((d) => ({
  diaSemana: d,
  horasTrabalho: 0,
}));

export default function MonitorEditSheet({
  monitorId,
  triggerClassName,
}: {
  monitorId: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [profLoading, setProfLoading] = React.useState(false);
  const [profError, setProfError] = React.useState<string | null>(null);
  const [professores, setProfessores] = React.useState<Professor[]>([]);
  const [detLoading, setDetLoading] = React.useState(false);

  const [form, setForm] = React.useState<FormState>({
    nome: "",
    email: "",
    tipo: "MONITOR",
    nomePesquisaMonitoria: "",
    cargaHorariaSemanal: 0,
    professorId: "",
    horarios: initialHorarios,
  });

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateHorario(dia: DiaSemana, horas: number) {
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.map((h) =>
        h.diaSemana === dia ? { ...h, horasTrabalho: horas } : h
      ),
    }));
  }

  const totalHoras = React.useMemo(
    () => form.horarios.reduce((s, h) => s + (Number(h.horasTrabalho) || 0), 0),
    [form.horarios]
  );
  const restante = Math.max(0, Number(form.cargaHorariaSemanal || 0) - totalHoras);
  const somaBate = totalHoras === Number(form.cargaHorariaSemanal || 0);
  const horariosValidos = form.horarios.every(
    (h) => h.horasTrabalho === 0 || (h.horasTrabalho >= 1 && h.horasTrabalho <= 8)
  );

  async function carregar() {
    setDetLoading(true);
    try {
      // Carrega detalhes do monitor
      const det = await buscarMonitor(monitorId);
      if (!det.ok) {
        toast.error(det.message || "Não foi possível carregar o monitor.");
        return;
      }
      const m = (det.monitor || {}) as MonitorDetail;
      const horariosSrv: ServerHorario[] = Array.isArray(m.horarios)
        ? m.horarios
        : [];
      const horariosMap = DIAS.map((d) => {
        const h = horariosSrv.find((x: ServerHorario) => (x?.diaSemana || x?.dia_semana) === d);
        return {
          diaSemana: d as DiaSemana,
          horasTrabalho: Number(
            h?.horasTrabalho ?? h?.horas_trabalho ?? 0
          ),
        };
      });
      setForm({
        nome: m.nome || "",
        email: m.email || "",
        tipo: (m.tipo === "PESQUISADOR" ? "PESQUISADOR" : "MONITOR") as
          | "MONITOR"
          | "PESQUISADOR",
        nomePesquisaMonitoria: m.nomePesquisaMonitoria || m.nome_pesquisa_monitoria || "",
        cargaHorariaSemanal: Number(m.cargaHorariaSemanal ?? m.carga_horaria_semanal ?? 0),
        professorId: m.professorId || m.professor_id || m.professor?.id || "",
        horarios: horariosMap,
      });
    } finally {
      setDetLoading(false);
    }
  }

  async function carregarProfessores() {
    setProfLoading(true);
    setProfError(null);
    try {
      const res = await fetch("/api/professores", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof body?.message === "string"
            ? body.message
            : `Erro ${res.status} ao carregar professores`;
        setProfError(msg);
        if (res.status === 401 || res.status === 403) {
          toast.error("Sem permissão para listar professores.");
        }
        return;
      }
      const list: Professor[] = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.items)
        ? body.items
        : [];
      setProfessores(list);
    } catch {
      setProfError("Falha ao contatar o servidor.");
    } finally {
      setProfLoading(false);
    }
  }

  React.useEffect(() => {
    if (!open) return;
    carregar();
    carregarProfessores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.professorId) {
      toast.error("Preencha nome, e-mail e professor.");
      return;
    }
    if (!form.cargaHorariaSemanal || form.cargaHorariaSemanal <= 0) {
      toast.error("Informe uma carga horária semanal válida.");
      return;
    }
    if (!somaBate) {
      toast.error(
        `A soma dos horários (${totalHoras}h) deve ser igual à carga semanal (${form.cargaHorariaSemanal}h).`
      );
      return;
    }
    if (!horariosValidos) {
      toast.error("Cada bloco diário deve ter entre 1 e 8 horas (ou 0 para não trabalhar).");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("nome", form.nome.trim());
      fd.set("email", form.email.trim());
      fd.set("tipo", form.tipo);
      fd.set("nomePesquisaMonitoria", form.nomePesquisaMonitoria.trim());
      fd.set("cargaHorariaSemanal", String(Number(form.cargaHorariaSemanal)));
      fd.set("professorId", form.professorId);
      const horariosEnviar = form.horarios
        .filter((h) => Number(h.horasTrabalho) > 0)
        .map((h) => ({
          diaSemana: h.diaSemana,
          horasTrabalho: Number(h.horasTrabalho),
        }));
      fd.set("horarios", JSON.stringify(horariosEnviar));

      const res = await updateMonitor(monitorId, fd);
      if (!res.ok) {
        toast.error(res.message || "Erro ao atualizar monitor.");
        return;
      }
      toast.success("Monitor atualizado com sucesso!");
      window.dispatchEvent(new CustomEvent("monitores:updated"));
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={
            triggerClassName ||
            "px-2 sm:px-3 py-1.5 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition-colors text-xs sm:text-sm font-medium"
          }
        >
          Editar
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] md:w-[600px] overflow-y-auto p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl">Editar Monitor</SheetTitle>
        </SheetHeader>

        {detLoading ? (
          <div className="py-8 text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 mt-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={form.tipo}
                    onValueChange={(v) =>
                      updateField("tipo", v as "MONITOR" | "PESQUISADOR")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONITOR">Monitor</SelectItem>
                      <SelectItem value="PESQUISADOR">Pesquisador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carga" className="text-sm">
                    Carga horária semanal (h)
                  </Label>
                  <Input
                    id="carga"
                    type="number"
                    min={1}
                    step={1}
                    value={form.cargaHorariaSemanal || 0}
                    onChange={(e) =>
                      updateField(
                        "cargaHorariaSemanal",
                        Number(e.target.value || 0)
                      )
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomePesquisa" className="text-sm">
                  Pesquisa/Monitoria
                </Label>
                <Input
                  id="nomePesquisa"
                  value={form.nomePesquisaMonitoria}
                  onChange={(e) =>
                    updateField("nomePesquisaMonitoria", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Professor</Label>
                <Select
                  value={form.professorId}
                  onValueChange={(v) => updateField("professorId", v)}
                  disabled={profLoading || (!!profError && professores.length === 0)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        profLoading ? "Carregando..." : "Selecione um professor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {professores.length > 0 ? (
                      professores.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {profError
                          ? "Não foi possível carregar"
                          : "Nenhum professor encontrado"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {profError && (
                  <div className="text-xs text-amber-600">{profError}</div>
                )}
              </div>
            </div>

            <Card className="p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm">
                  <span className="font-medium">Distribuição semanal de horas</span>
                  <div className="text-xs text-muted-foreground">
                    Cada dia: 1–8h (ou 0 para não trabalhar)
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div
                    className={`text-sm font-medium ${
                      somaBate ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    Total: {totalHoras}h / {form.cargaHorariaSemanal || 0}h
                  </div>
                  {!somaBate && (
                    <div className="text-xs text-amber-600">
                      {restante > 0 ? `Faltam ${restante}h` : `Excedeu em ${Math.abs(restante)}h`}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {form.horarios.map((h) => (
                  <div key={h.diaSemana} className="space-y-1">
                    <Label className="text-xs">
                      {h.diaSemana.charAt(0) + h.diaSemana.slice(1).toLowerCase()}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={8}
                      step={1}
                      value={h.horasTrabalho}
                      onChange={(e) =>
                        updateHorario(h.diaSemana, Number(e.target.value || 0))
                      }
                    />
                    {h.horasTrabalho !== 0 &&
                      (h.horasTrabalho < 1 || h.horasTrabalho > 8) && (
                        <div className="text-xs text-red-600">1 a 8 horas</div>
                      )}
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !somaBate || !horariosValidos || !form.professorId}
                className="w-full sm:w-auto"
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
