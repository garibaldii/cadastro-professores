"use server";

import { apiFetch } from "../api";
import { ActionResponse, getErrorMessage, handleApiResponse } from "./common";
import { revalidatePath } from "next/cache";

export async function saveProfessor(form: FormData): Promise<ActionResponse> {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await apiFetch("/professores", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/professor/relatorio");
    }

    return result;
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function updateProfessor(
  id: number,
  form: FormData
): Promise<ActionResponse> {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await apiFetch(`/professores/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const result = await handleApiResponse(res);

    if (result.status === "SUCCESS") {
      revalidatePath("/professor/relatorio");
    }

    return result;
  } catch (error: unknown) {
    console.error("Erro na action:", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function getProfessors() {
  try {
    const res = await apiFetch("/professores", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.message ?? "Erro ao buscar professores",
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

export async function getProfessorById(id: number) {
  try {
    const res = await apiFetch(`/professores/${id}`, {
      method: "GET",
    });

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function deleteProfessor(id: number): Promise<void> {
  try {
    const res = await apiFetch(`/professores/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.mensagem || "Erro ao deletar professor");
    }

    revalidatePath("/professor/relatorio");
  } catch (error) {
    console.error("Erro na action: ", error);
    throw new Error(getErrorMessage(error));
  }
}
