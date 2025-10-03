"use server";

import { apiFetch } from "../api";

export async function getTitulacoes() {
  try {
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
    const res = await apiFetch("/enums/modeloCurso", {
      method: "GET",
    });
    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}
