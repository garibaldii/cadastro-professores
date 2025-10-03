"use server";

import { cookies } from "next/headers";
import { apiFetch } from "../api";
import { ActionResponse, getErrorMessage } from "./common";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  userName: string;
  email: string;
}

export async function saveUser(form: FormData): Promise<ActionResponse> {
  try {
    const body = Object.fromEntries(form.entries());

    const res = await apiFetch("/usuarios", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error:
          errorData?.erro || errorData?.message || "Erro ao cadastrar usuário",
        status: "ERROR",
      };
    }

    const data = await res.json();
    return { error: "", status: "SUCCESS", data };
  } catch (error: unknown) {
    console.error("Erro na action:", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

export async function login(form: FormData): Promise<ActionResponse> {
  async function setAuthToken(token: string) {
    (await cookies()).set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  try {
    const body = Object.fromEntries(form.entries());
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.message ?? "Erro ao fazer login",
        status: "ERROR",
      };
    }

    const data = await res.json();
    await setAuthToken(data.token);

    return { error: "", status: "SUCCESS", data };
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}

async function getUserById(id: string) {
  try {
    const res = await apiFetch(`/usuarios/${id}`, {
      method: "GET",
    });

    return res.json();
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: "erro inesperado", status: "ERROR" };
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwtDecode<DecodedToken>(token as string);
    const user = await getUserById(payload.userId);
    return user?.data ?? null;
  } catch (error) {
    console.error("Erro ao obter sessão: ", error);
    return null;
  }
}
