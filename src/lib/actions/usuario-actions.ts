"use server";

import { cookies } from "next/headers";
import { getApiBase } from "../api";
import type { Usuario, UsuarioListResponse, ToggleStatusResponse } from "@/types/usuario";

/**
 * Lista todos os usuários (apenas para ADMIN ou SUPER_ADMIN)
 */
export async function listarUsuarios(): Promise<{
  ok: boolean;
  status: number;
  usuarios: Usuario[];
  message?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { ok: false, status: 401, usuarios: [], message: "Sessão expirada. Faça login novamente." };
  }

  const API_URL = getApiBase();

  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as UsuarioListResponse;
      return {
        ok: false,
        status: res.status,
        usuarios: [],
        message: body?.mensagem || body?.message || `Erro ${res.status} ao listar usuários`,
      };
    }

    const body = await res.json() as UsuarioListResponse;
    const usuarios = body.data || body.items || [];

    return { ok: true, status: 200, usuarios };
  } catch {
    return { ok: false, status: 502, usuarios: [], message: "Falha de comunicação com o servidor." };
  }
}

/**
 * Alterna o status (ativo/inativo) de um usuário (apenas SUPER_ADMIN)
 */
export async function toggleUsuarioStatus(usuarioId: string): Promise<{
  ok: boolean;
  status: number;
  message?: string;
  usuario?: Usuario;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { ok: false, status: 401, message: "Sessão expirada. Faça login novamente." };
  }

  if (!usuarioId || typeof usuarioId !== "string") {
    return { ok: false, status: 400, message: "ID de usuário inválido." };
  }

  const API_URL = getApiBase();

  try {
    const res = await fetch(`${API_URL}/usuarios/${usuarioId}/toggle-status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as ToggleStatusResponse;
      return {
        ok: false,
        status: res.status,
        message: body?.mensagem || body?.message || `Erro ${res.status} ao alterar status`,
      };
    }

    const body = await res.json() as ToggleStatusResponse;
    return {
      ok: true,
      status: 200,
      message: body?.mensagem || body?.message || "Status alterado com sucesso",
      usuario: body.data,
    };
  } catch {
    return { ok: false, status: 502, message: "Falha de comunicação com o servidor." };
  }
}

/**
 * Busca detalhes de um usuário específico
 */
export async function buscarUsuario(usuarioId: string): Promise<{
  ok: boolean;
  status: number;
  usuario?: Usuario;
  message?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { ok: false, status: 401, message: "Sessão expirada. Faça login novamente." };
  }

  if (!usuarioId || typeof usuarioId !== "string") {
    return { ok: false, status: 400, message: "ID de usuário inválido." };
  }

  const API_URL = getApiBase();

  try {
    const res = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { message?: string; mensagem?: string };
      return {
        ok: false,
        status: res.status,
        message: body?.mensagem || body?.message || `Erro ${res.status} ao buscar usuário`,
      };
    }

    const body = await res.json() as { data?: Usuario; usuario?: Usuario };
    const usuario = body.data || body.usuario;

    return { ok: true, status: 200, usuario };
  } catch {
    return { ok: false, status: 502, message: "Falha de comunicação com o servidor." };
  }
}
