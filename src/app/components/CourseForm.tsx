"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModeloCurso, getProfessors, saveCourse } from "@/lib/actions/index";
import React, { useActionState, useEffect, useState } from "react";
import { Professor } from "../(root)/professor/relatorio/columns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { createCourseSchema } from "@/lib/validation";
import { Send, Plus } from "lucide-react";
import MateriaModal, { Materia } from "./MateriaModal";
import MateriaList from "./MateriaList";

const CourseForm = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [modelosCurso, setModelosCurso] = useState<string[]>();
  const [professors, setProfessors] = useState<Professor[]>();

  // Estados para matérias
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [m, p] = await Promise.all([getModeloCurso(), getProfessors()]);

        setModelosCurso(Array.isArray(m?.data) ? m.data : []);

        // Se o retorno de getProfessors() for um objeto, extrai o campo correto
        const profs = Array.isArray(p)
          ? p
          : Array.isArray(p?.data)
          ? p.data
          : [];

        if (!Array.isArray(profs) || profs.length === 0) {
          toast.warning("Nenhum professor encontrado", {
            description: "Cadastre professores antes de criar um curso.",
            duration: 60000,
            position: "top-center",
          });
        }

        setProfessors(profs);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setModelosCurso([]);
        setProfessors([]);
      }
    }

    fetchData();
  }, []);

  // Funções para gerenciar matérias
  const handleAddMateria = (novaMateria: Omit<Materia, "id">) => {
    setMaterias((prev) => [...prev, { ...novaMateria, id: Date.now() }]);
  };

  const handleUpdateMateria = (materiaAtualizada: Materia) => {
    setMaterias((prev) =>
      prev.map((m) => (m.id === materiaAtualizada.id ? materiaAtualizada : m))
    );
    setEditingMateria(null);
  };

  const handleRemoveMateria = (index: number) => {
    setMaterias((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditMateria = (materia: Materia) => {
    setEditingMateria(materia);
    setIsMateriaModalOpen(true);
  };

  const handleOpenMateriaModal = () => {
    setEditingMateria(null);
    setIsMateriaModalOpen(true);
  };

  const handleCloseMateriaModal = () => {
    setEditingMateria(null);
    setIsMateriaModalOpen(false);
  };

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const formValues = {
        nome: formData.get("nome") as string,
        codigo: formData.get("codigo") as string,
        sigla: formData.get("sigla") as string,
        modelo: formData.get("modelo") as string,
        coordenadorId: formData.get("coordenadorId") as string,
        materias: materias.map((m) => ({
          nome: m.nome,
          cargaHoraria: m.cargaHoraria,
          professorId: m.professorId,
        })),
      };

      await createCourseSchema.parseAsync(formValues);

      const result = await saveCourse(formValues);

      if (result.status === "ERROR") {
        toast.error("Erro ao cadastrar curso", {
          description: result.error,
          position: "top-center",
        });
        return result;
      }

      toast.success("Curso cadastrado com sucesso!", {
        description: "Direcionando para a lista de Cursos...",
        duration: 5000,
        position: "top-center",
      });

      router.push("/curso/relatorio");

      return result;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro inesperado do servidor";
        toast.error("Erro de validação", {
          description: errorMessage,
          dismissible: true,
        });
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
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0">
        <div className="w-full md:w-3/4 md:mr-3">
          <label htmlFor="nome" className="cadastro-form_label">
            Nome
          </label>
          <Input id="nome" name="nome" required placeholder="Nome do curso" />
          {errors.nome && <p className="startup-form_error">{errors.nome}</p>}
        </div>

        <div className="w-full md:w-auto md:mr-3">
          <label htmlFor="sigla" className="cadastro-form_label">
            Sigla
          </label>
          <Input
            id="sigla"
            name="sigla"
            required
            maxLength={4}
            placeholder="ex: DSM"
          />
          {errors.sigla && <p className="startup-form_error">{errors.sigla}</p>}
        </div>

        <div className="w-full md:w-auto">
          <label htmlFor="codigo" className="cadastro-form_label">
            Código
          </label>
          <Input
            id="codigo"
            name="codigo"
            type="text"
            inputMode="numeric"
            maxLength={4}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, ""); // remove tudo que não for número
            }}
            required
            placeholder="ex: 301"
          />
          {errors.codigo && (
            <p className="startup-form_error">{errors.codigo}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="modelo" className="cadastro-form_label">
          Modelo de Ensino
        </label>
        <Select name="modelo">
          <SelectTrigger className="cadastro-form_select !w-full">
            <SelectValue placeholder="Selecionar o modelo de ensino" />
          </SelectTrigger>

          <SelectContent>
            {/* consumir os valores do endpoint de titulacao da api */}
            {modelosCurso?.map((item: string, index: number) => (
              <SelectItem value={item} key={index}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.modelo && <p className="startup-form_error">{errors.modelo}</p>}
      </div>

      <div>
        <label htmlFor="coordenadorId" className="cadastro-form_label">
          Coordenador
        </label>

          <Select name="coordenadorId">
            <SelectTrigger className="cadastro-form_select !w-full">
              <SelectValue placeholder="Selecionar o coordenador" />
            </SelectTrigger>

            <SelectContent>
              {professors?.map((prof) => (
                <SelectItem key={prof.id} value={String(prof.id)}>
                  {prof.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        

        {errors.coordenadorId && (
          <p className="startup-form_error">{errors.coordenadorId}</p>
        )}
      </div>

      {/* Seção de Matérias */}
      <div className="border-t pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Matérias do Curso
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenMateriaModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Matéria
          </Button>
        </div>

        <MateriaList
          materias={materias}
          onEditMateria={handleEditMateria}
          onRemoveMateria={handleRemoveMateria}
        />
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Cadastrando..." : "Cadastrar"}
        <Send className="size-6 ml-2" />
      </Button>

      {/* Modal de Matérias */}
      <MateriaModal
        isOpen={isMateriaModalOpen}
        onClose={handleCloseMateriaModal}
        professors={professors || []}
        onAddMateria={handleAddMateria}
        editingMateria={editingMateria}
        onUpdateMateria={handleUpdateMateria}
      />
    </form>
  );
};

export default CourseForm;
