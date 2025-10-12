export function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err ?? "Erro inesperado");
}

export interface ActionResponse<T = unknown> {
  error: string;
  status: "SUCCESS" | "ERROR";
  data?: T;
}

export async function handleApiResponse<T>(
  res: Response
): Promise<ActionResponse<T>> {
  try {
    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData.mensagem ?? errorData.erro ?? "Erro na operação",
        status: "ERROR",
      };
    }

    const data = await res.json();
    return {
      error: "",
      status: "SUCCESS",
      data: data.data ?? data,
    };
  } catch (error) {
    console.error("Erro na action: ", error);
    return { error: getErrorMessage(error), status: "ERROR" };
  }
}
