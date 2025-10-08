"use server";

import { apiFetch } from "../api";
import { ActionResponse, getErrorMessage, handleApiResponse } from "./common";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth-actions";

export async function saveProfessor(form: FormData): Promise<ActionResponse> {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

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
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

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
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

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
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

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
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

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

export async function uploadProfessorPlanilha(
  formData: FormData
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

    // Validar se o arquivo foi enviado
    const file = formData.get("file") as File;
    if (!file) {
      return {
        error: "Nenhum arquivo foi selecionado.",
        status: "ERROR",
      };
    }

    // Validar tipo do arquivo
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error:
          "Tipo de arquivo não suportado. Use apenas arquivos Excel (.xlsx, .xls) ou CSV.",
        status: "ERROR",
      };
    }

    // Validar tamanho do arquivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        error: "Arquivo muito grande. O tamanho máximo permitido é 10MB.",
        status: "ERROR",
      };
    }

    const token = (await (await import("next/headers")).cookies()).get(
      "token"
    )?.value;

    const apiUrl = process.env.API_URL || "http://localhost:3001";

    const uploadUrl = `${apiUrl}/professores/upload/planilha-modelo.xlsx`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          error:
            "Rota de upload não encontrada. Verifique se a API suporta upload de arquivos.",
          status: "ERROR",
        };
      }

      try {
        const errorText = await res.text();
        if (errorText.includes("<")) {
          return {
            error: `Erro no upload: ${res.status} - ${res.statusText}`,
            status: "ERROR",
          };
        }
        const errorData = JSON.parse(errorText);
        return {
          error:
            errorData.message ??
            errorData.erro ??
            `Erro no upload: ${res.status}`,
          status: "ERROR",
        };
      } catch {
        return {
          error: `Erro no upload: ${res.status} - ${res.statusText}`,
          status: "ERROR",
        };
      }
    }

    try {
      const data = await res.json();
      revalidatePath("/professor/relatorio");
      return {
        error: "",
        status: "SUCCESS",
        data: data.data ?? data,
      };
    } catch {
      revalidatePath("/professor/relatorio");
      return {
        error: "",
        status: "SUCCESS",
        data: "Upload realizado com sucesso",
      };
    }
  } catch (error) {
    console.error("Erro no upload da planilha: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}
