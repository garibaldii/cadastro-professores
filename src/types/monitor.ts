// Tipos de Monitor
export type TipoMonitor = "MONITOR" | "PESQUISADOR";

export type DiaSemana =
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO"
  | "DOMINGO";

export interface HorarioTrabalho {
  id?: string;
  diaSemana: DiaSemana;
  horasTrabalho: number;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  isActive: boolean;
  role?: string;
  roles?: string[];
}

export interface Monitor {
  id: string;
  nome: string;
  email: string;
  cargaHorariaSemanal: number;
  tipo: TipoMonitor;
  nomePesquisaMonitoria: string;
  professorId: string;
  professor?: Professor;
  usuario?: Usuario;
  horarios: HorarioTrabalho[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateMonitorDto {
  nome: string;
  email: string;
  cargaHorariaSemanal: number;
  tipo: TipoMonitor;
  nomePesquisaMonitoria: string;
  professorId: string;
  horarios: Omit<HorarioTrabalho, 'id'>[];
}

export interface UpdateMonitorDto {
  nome?: string;
  email?: string;
  cargaHorariaSemanal?: number;
  tipo?: TipoMonitor;
  nomePesquisaMonitoria?: string;
  professorId?: string;
  horarios?: Omit<HorarioTrabalho, 'id'>[];
}

export interface MonitorListResponse {
  success: boolean;
  data?: Monitor[];
  items?: Monitor[];
  message?: string;
  mensagem?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
