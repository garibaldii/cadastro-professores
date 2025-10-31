// Tipos de Usuário
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  isActive: boolean;
  role?: string;
  roles?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  roles?: UserRole[];
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  isActive?: boolean;
  roles?: UserRole[];
}

export interface UsuarioListResponse {
  success: boolean;
  data?: Usuario[];
  items?: Usuario[];
  message?: string;
  mensagem?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ToggleStatusResponse {
  success: boolean;
  message?: string;
  mensagem?: string;
  data?: Usuario;
}
