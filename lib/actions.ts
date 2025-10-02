"use server";

import { cookies } from "next/headers";
import { apiFetch } from "./api";
import { jwtDecode } from "jwt-decode";



//professor
export async function saveProfessor(form: FormData) {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await apiFetch("/professores", {
      method: "POST",
      body: JSON.stringify(body)
    })

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

export async function getProfessors() {

  try {
    const res = await apiFetch("/professores", {
      method: "GET",
      headers: { "Content-Type": "application/json" },

    })

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message ?? "Erro ao salvar", status: "ERROR" };
    }

    const data = await res.json()

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
    })

    const data = await res.json()

    return data.data
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

//usuario
export async function saveUser(form: FormData) {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await apiFetch("/usuarios", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.erro || "Erro ao cadastrar usuário");
    }

    return await res.json();
  } catch (error: any) {
    console.error("Erro na action:", error);
    return { error: error.message || "Erro inesperado", status: "ERROR" };
  }
}

export async function login(form: FormData) {

  async function setAuthToken(token: string) {
    (await cookies()).set("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    })
  }

  try {
    const body = Object.fromEntries(form.entries());
    const res = await apiFetch('/auth/login', {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log(JSON.stringify(errorData))
      return { error: errorData.message ?? "Erro ao salvar " + errorData.message, status: "ERROR" };
    }

    const data = await res.json()

    await setAuthToken(data.token)

    return { error: "", status: "SUCCESS", data: data };
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

async function getUserById(id: string) {
  try {
    const res = await apiFetch(`/usuarios/${id}`, {
      method: "GET"
    })

    return res.json()
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

// curso.ts
export async function saveCourse(body: Record<string, any>) {
  try {
    const res = await apiFetch("/cursos", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.mensagem);
    }

    return await res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    throw error;
  }
}

export async function deleteCourse(id: number) {
  try {
    const res = await apiFetch(`/cursos/${id}`, {
      method: "DELETE"
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.mensagem)
    }

    // Se não houver corpo, retorna null
    const text = await res.text()
    return text ? JSON.parse(text) : null

  } catch (error) {
    console.error("Erro na action: ", error)
    throw error
  }
}

export async function updateCourse(id: number, body: Record<string, any>) {

  try {
    const res = await apiFetch(`/cursos/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.erro || "Erro ao atualizar curso");
    }

    return await res.json();
  } catch (error: any) {
    console.error("Erro na action: ", error);
    throw error;
  }

}

export async function getCourses() {
  try {
    const res = await apiFetch("/cursos", {
      method: "GET",
    })

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message ?? "Erro ao salvar", status: "ERROR" };
    }

    const data = await res.json()

    return data.data;

  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getCourseById(id: number) {
  try {
    const res = await apiFetch(`/cursos/${id}`, {
      method: "GET",
    })

    const data = await res.json()

    return data.data
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}


//utilitarios professor
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


//utilitarios usuario

export async function getSession() {

  interface DecodedToken {
    userId: string,
    userName: string,
    email: string
  }

  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (token) {
    const payload = jwtDecode<DecodedToken>(token);

    const user = await getUserById(payload.userId)

    return user.data
  } else {
    throw new Error("Token inválido")

  }

}


//utilitarios curso

export async function getModeloCurso() {
  try {
    const res = await apiFetch("/enums/modeloCurso", {
      method: "GET"
    })
    return res.json()
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}


