"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Professor } from "../(root)/professor/relatorio/columns";
import { createMateriaSchema } from "@/lib/validation";
import z from "zod";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export interface Materia {
  id?: number;
  nome: string;
  cargaHoraria: number;
  professorId: number;
  professor?: Professor;
}

interface MateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  professors: Professor[];
  onAddMateria: (materia: Omit<Materia, "id">) => void;
  editingMateria?: Materia | null;
  onUpdateMateria?: (materia: Materia) => void;
}

const MateriaModal = ({
  isOpen,
  onClose,
  professors,
  onAddMateria,
  editingMateria,
  onUpdateMateria,
}: MateriaModalProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>(
    editingMateria?.professorId?.toString() || ""
  );

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const formValues = {
        nome: formData.get("nome") as string,
        cargaHoraria: Number(formData.get("cargaHoraria")),
        professorId: Number(formData.get("professorId")),
      };

      await createMateriaSchema.omit({ cursos: true }).parseAsync(formValues);

      const selectedProfessor = professors.find(p => p.id === formValues.professorId);

      const materia: Materia = {
        ...formValues,
        professor: selectedProfessor,
        ...(editingMateria?.id && { id: editingMateria.id }),
      };

      if (editingMateria && onUpdateMateria) {
        onUpdateMateria(materia);
        toast.success("Matéria atualizada com sucesso!");
      } else {
        onAddMateria(materia);
        toast.success("Matéria adicionada com sucesso!");
      }

      // Reset form
      setErrors({});
      setSelectedProfessorId("");
      onClose();

      return { error: "", status: "SUCCESS" as const };
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

  const handleClose = () => {
    setErrors({});
    setSelectedProfessorId(editingMateria?.professorId?.toString() || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingMateria ? "Editar Matéria" : "Adicionar Matéria"}
          </DialogTitle>
          <DialogDescription>
            {editingMateria
              ? "Edite as informações da matéria."
              : "Preencha as informações para adicionar uma nova matéria ao curso."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="nome" className="cadastro-form_label">
              Nome da Matéria
            </label>
            <Input
              id="nome"
              name="nome"
              required
              placeholder="Nome da matéria"
              defaultValue={editingMateria?.nome || ""}
            />
            {errors.nome && <p className="startup-form_error">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cargaHoraria" className="cadastro-form_label">
                Carga Horária (horas)
              </label>
              <Input
                id="cargaHoraria"
                name="cargaHoraria"
                type="number"
                min="1"
                max="1000"
                required
                placeholder="Ex: 80"
                defaultValue={editingMateria?.cargaHoraria || ""}
              />
              {errors.cargaHoraria && (
                <p className="startup-form_error">{errors.cargaHoraria}</p>
              )}
            </div>

            <div>
              <label htmlFor="professorId" className="cadastro-form_label">
                Professor
              </label>
              <Select
                name="professorId"
                value={selectedProfessorId}
                onValueChange={setSelectedProfessorId}
                required
              >
                <SelectTrigger className="cadastro-form_select">
                  <SelectValue placeholder="Selecionar professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors?.map((professor) => (
                    <SelectItem key={professor.id} value={String(professor.id)}>
                      {professor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.professorId && (
                <p className="startup-form_error">{errors.professorId}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoading
                ? "Salvando..."
                : editingMateria
                ? "Atualizar"
                : "Adicionar"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MateriaModal;