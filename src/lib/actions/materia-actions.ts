"use server";

import { apiFetch } from "../api";
import { ActionResponse, getErrorMessage, handleApiResponse } from "./common";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth-actions";

export async function saveMateria(
  body: Record<string, unknown>
): Promise<ActionResponse> {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch("/materias", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/curso/cadastro");
    }

    return result;
  } catch (error: unknown) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function updateMateria(
  id: number,
  body: Record<string, unknown>
): Promise<ActionResponse> {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/materias/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/curso/cadastro");
    }

    return result;
  } catch (error: unknown) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function getMaterias() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch("/materias", {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.message ?? "Erro ao buscar matérias",
        status: "ERROR",
      };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getMateriaById(id: number) {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/materias/${id}`, {
      method: "GET",
    });

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function deleteMateria(id: number): Promise<void> {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    const res = await apiFetch(`/materias/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.mensagem || "Erro ao deletar matéria");
    }

    revalidatePath("/curso/cadastro");
  } catch (error) {
    console.error("Erro na action: ", error);
    throw new Error(getErrorMessage(error));
  }
}
