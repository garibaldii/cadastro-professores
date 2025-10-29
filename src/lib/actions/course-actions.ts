"use server";

import { apiFetch } from "../api";
import { ActionResponse, getErrorMessage, handleApiResponse } from "./common";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth-actions";

export async function saveCourse(
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

    const res = await apiFetch("/cursos", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/curso/relatorio");
    }

    return result;
  } catch (error: unknown) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function deleteCourse(id: string | number): Promise<void> {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    const res = await apiFetch(`/cursos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.mensagem || "Erro ao deletar curso");
    }

    revalidatePath("/curso/relatorio");
  } catch (error) {
    console.error("Erro na action: ", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateCourse(
  id: string | number,
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

    const res = await apiFetch(`/cursos/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/curso/relatorio");
    }

    return result;
  } catch (error: unknown) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function getCourses() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch("/cursos", {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.message ?? "Erro ao buscar cursos",
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

export async function getCourseById(id: string | number) {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/cursos/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erro ao buscar curso:", errorData);
      return {
        error: errorData.message ?? "Erro ao buscar curso",
        status: "ERROR",
      };
    }

    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error("Erro na action getCourseById: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}
