"use server";

export async function saveProfessor(form: FormData) {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await fetch(`${process.env.API_URL}/professores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message ?? "Erro ao salvar", status: "ERROR" };
    }

    return { error: "", status: "SUCCESS" };
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function saveUser(form: FormData) {
  try {
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`${process.env.API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log(JSON.stringify(errorData))
      return { error: errorData.message ?? "Erro ao salvar " + errorData.message, status: "ERROR" };
    }

    return { error: "", status: "SUCCESS" };
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getTitulacoes() {
  try {
    const res = await fetch(`${process.env.API_URL}/enums/titulacao`, {
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
    const res = await fetch(`${process.env.API_URL}/enums/referencia`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getStatusAtividade() {
  try {
    const res = await fetch(`${process.env.API_URL}/enums/statusAtividade`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}
