"use server";

import { apiFetch } from "../api";
import { getSession } from "./auth-actions";

export async function getTitulacoes() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/enums/titulacao`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getReferencias() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/enums/referencia`, {
      method: "GET",
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getStatusAtividade() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch(`/enums/statusAtividade`, {
      method: "GET",
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getModeloCurso() {
  try {
    // Verificar autenticação
    const session = await getSession();
    if (!session) {
      return {
        error: "Não autorizado. Faça login novamente.",
        status: "ERROR",
      };
    }

    const res = await apiFetch("/enums/modeloCurso", {
      method: "GET",
    });
    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}
