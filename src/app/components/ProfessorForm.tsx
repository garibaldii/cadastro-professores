"use client";

import React, { useState, useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { createProfessorSchema } from "@/lib/validation";
import z from "zod";
import {
  getReferencias,
  getStatusAtividade,
  getTitulacoes,
  saveProfessor,
} from "@/lib/actions/index";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProfessorForm = () => {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [titulacoes, setTitulacoes] = useState<string[]>();
  const [referencias, setReferencias] = useState<string[]>();
  const [statusAtividades, setStatusAtividade] = useState<string[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const [t, r, s] = await Promise.all([
          getTitulacoes(),
          getReferencias(),
          getStatusAtividade(),
        ]);

        setTitulacoes(t?.data || []);
        setReferencias(r?.data || []);
        setStatusAtividade(s?.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const formValues = {
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        titulacao: formData.get("titulacao") as string,
        idUnidade: formData.get("idUnidade") as string,
        referencia: formData.get("referencia") as string,
        lattes: formData.get("lattes") as string,
        statusAtividade: formData.get("statusAtividade") as string,
        observacoes: formData.get("observacoes") as string,
      };

      await createProfessorSchema.parseAsync(formValues);

      const result = await saveProfessor(formData);

      if (result.status === "ERROR") {
        toast.error("Erro ao cadastrar professor", {
          description: result.error,
          position: "top-center",
        });
        return result;
      }

      toast.success("Professor cadastrado com sucesso!", {
        description: "Direcionando para a lista de professores...",
        duration: 5000,
        position: "top-center",
      });

      router.push("/professor/relatorio");

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      return { error: errorMessage, status: "ERROR" as const };
    }
  };

  const [, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "ERROR" as const,
  });

  return (
    <form action={formAction} className="cadastro-form">
      <div className="flex w-full">
        <div className="cadastro-form_col-div">
          <label htmlFor="nome" className="cadastro-form_label">
            Nome
          </label>
          <Input
            id="nome"
            name="nome"
            required
            placeholder="Nome do Professor"
          />
          {errors.nome && <p className="startup-form_error">{errors.nome}</p>}
        </div>

        <div className="cadastro-form_col-div !mr-0">
          <label htmlFor="email" className="cadastro-form_label">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Endereço de E-mail"
          />
          {errors.email && <p className="startup-form_error">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="titulacao" className="cadastro-form_label">
            Titulação
          </label>
          <Select name="titulacao">
            <SelectTrigger className="cadastro-form_select">
              <SelectValue placeholder="Selecionar titulação" />
            </SelectTrigger>

            <SelectContent>
              {/* consumir os valores do endpoint de titulacao da api */}
              {titulacoes?.map((item: string, index: number) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.titulacao && (
            <p className="startup-form_error">{errors.titulacao}</p>
          )}
        </div>

        <div>
          <label htmlFor="referencia" className="cadastro-form_label">
            Referência
          </label>
          <Select name="referencia">
            <SelectTrigger className="cadastro-form_select">
              <SelectValue placeholder="Selecionar Referência" />
            </SelectTrigger>

            <SelectContent>
              {/* consumir os valores do endpoint de titulacao da api */}
              {referencias?.map((item: string, index: number) => (
                <SelectItem value={item} key={index}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.referencia && (
            <p className="startup-form_error">{errors.referencia}</p>
          )}
        </div>

        <div>
          <label htmlFor="statusAtividade" className="cadastro-form_label">
            Status da Atividade
          </label>
          <Select name="statusAtividade">
            <SelectTrigger className="cadastro-form_select">
              <SelectValue placeholder="Selecione o status do professor" />
            </SelectTrigger>

            <SelectContent>
              {/* consumir os valores do endpoint de titulacao da api */}
              {statusAtividades?.map((item: string, index: number) => (
                <SelectItem value={item} key={index}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.statusAtividade && (
            <p className="startup-form_error">{errors.statusAtividade}</p>
          )}
        </div>
      </div>

      <label htmlFor="lattes" className="cadastro-form_label">
        Lattes
      </label>
      <Input
        id="lattes"
        type="url"
        name="lattes"
        required
        placeholder="Url do Lattes"
      />
      {errors.lattes && <p className="startup-form_error">{errors.lattes}</p>}

      <label htmlFor="idUnidade" className="cadastro-form_label">
        ID da Unidade
      </label>

      <Input
        id="idUnidade"
        name="idUnidade"
        type="text"
        inputMode="numeric"
        maxLength={5}
        required
        placeholder="Digite o id da unidade respectiva"
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/\D/g, ""); // remove tudo que não for número
        }}
      />

      {errors.idUnidade && (
        <p className="startup-form_error">{errors.idUnidade}</p>
      )}

      <label htmlFor="observacoes" className="cadastro-form_label">
        Observações
      </label>
      <Textarea
        id="observacoes"
        name="observacoes"
        placeholder="Há observações?"
      />

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Cadastrando..." : "Cadastrar"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ProfessorForm;
