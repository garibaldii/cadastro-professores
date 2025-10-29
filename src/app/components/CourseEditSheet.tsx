import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getCourseById,
  getModeloCurso,
  getProfessors,
  updateCourse,
} from "@/lib/actions/index";
import { Loader2, Pencil, Plus } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import { Course } from "../(root)/curso/relatorio/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Professor } from "../(root)/professor/relatorio/columns";
import { toast } from "sonner";
import MateriaModal, { Materia } from "./MateriaModal";
import MateriaList from "./MateriaList";

interface CourseEditSheetProps {
  data: { id: string | number };
  onUpdateFn?: (id: string | number) => Promise<void>;
}

const CourseEditSheet = ({ data, onUpdateFn }: CourseEditSheetProps) => {
  //variáveis para configurarmos a visibilidade do Sheet
  const [isOpen, setIsOpen] = useState(false);

  //Objeto que vamos trabalhar
  const [course, setCourse] = useState<Course | null>(null);

  //chamadas na api
  const [modelosCurso, setModelosCurso] = useState<string[]>();
  const [professors, setProfessors] = useState<Professor[]>();

  //pegar o selecionado
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [selectedModelo, setSelectedModelo] = useState<string>("");

  // Estados para matérias
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [m, p, c] = await Promise.all([
          getModeloCurso(),
          getProfessors(),
          getCourseById(data.id),
        ]);

        setModelosCurso(m?.data || []);
        setProfessors(p || []);
        setCourse(c);

        if (c?.coordenador) {
          setSelectedProfessorId(String(c.coordenador.id));
        }

        if (c?.modelo) {
          setSelectedModelo(c.modelo);
        }
        setMaterias([]);

        if (c?.materias && Array.isArray(c.materias) && c.materias.length > 0) {
          try {
            const materiasFormatadas: Materia[] = c.materias
              .filter(
                (relacionamento: unknown) =>
                  relacionamento !== null && relacionamento !== undefined
              )
              .map((relacionamento: unknown) => {
                const rel = relacionamento as Record<string, unknown>;

                const materiaData = rel.materia as Record<string, unknown>;

                if (!materiaData) {
                  console.warn(
                    "Dados da matéria não encontrados no relacionamento"
                  );
                  return null;
                }

                // Buscar professor
                const professorId = materiaData.professorId as string;
                const professor =
                  (p || []).find(
                    (prof: Professor) => prof.id === professorId
                  ) || (materiaData.professor as Professor);

                const materiaFormatada = {
                  id: materiaData.id as number,
                  nome: materiaData.nome as string,
                  cargaHoraria: materiaData.cargaHoraria as number,
                  professorId: professorId,
                  professor: professor,
                };

                return materiaFormatada;
              })
              .filter(
                (m: Materia | null) =>
                  m !== null &&
                  m.id &&
                  m.nome &&
                  m.cargaHoraria &&
                  m.professorId
              ) as Materia[];

            setMaterias(materiasFormatadas);
          } catch (error) {
            console.error("Erro ao processar matérias:", error);
          }
        } else {
          console.warn("Nenhuma matéria válida encontrada");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }

    fetchData();
  }, [data.id]);
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

      const result = await updateCourse(data.id, formValues);

      if (result.status === "ERROR") {
        toast.error("Erro ao atualizar", {
          description: result.error,
          position: "top-center",
        });
        return result;
      }

      toast.success("Curso atualizado!", {
        description: "Os dados foram atualizados com sucesso",
        duration: 4000,
        position: "top-center",
      });

      setIsOpen(false);

      // Call the update callback if provided
      if (onUpdateFn) {
        await onUpdateFn(data.id);
      }

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado do servidor";
      toast.error("Erro de validação", {
        description: errorMessage,
        dismissible: true,
        position: "top-center",
      });
      return { error: errorMessage, status: "ERROR" as const };
    }
  };

  const [, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "ERROR" as const,
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Pencil />
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-hidden flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Editar Curso</SheetTitle>
          <SheetDescription>
            Faça suas alterações, clique em salvar quando finalizar
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {course ? (
            <form action={formAction} className="cadastro-form !shadow-none">
              <div className="grid flex-1 auto-rows-min gap-6 px-4 pb-6">
                <div className="flex w-full">
                  <div className="w-11/12 mr-3">
                    <label htmlFor="nome" className="cadastro-form_label">
                      Nome
                    </label>
                    <Input
                      id="nome"
                      name="nome"
                      required
                      defaultValue={course?.nome}
                    />
                  </div>

                  <div className="mr-3">
                    <label htmlFor="sigla" className="cadastro-form_label">
                      Sigla
                    </label>
                    <Input
                      id="sigla"
                      name="sigla"
                      required
                      maxLength={4}
                      defaultValue={course?.sigla}
                    />
                  </div>
                </div>

                <div className="">
                  <label htmlFor="codigo" className="cadastro-form_label">
                    Código
                  </label>
                  <Input
                    id="codigo"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    name="codigo"
                    defaultValue={course?.codigo}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/\D/g, ""); // remove tudo que não for número
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="modelo" className="cadastro-form_label">
                    Modelo
                  </label>
                  <Select
                    name="modelo"
                    value={selectedModelo}
                    onValueChange={setSelectedModelo}
                    required
                  >
                    <SelectTrigger className="cadastro-form_select !w-full">
                      <SelectValue placeholder="Selecionar o modelo de ensino" />
                    </SelectTrigger>

                    <SelectContent>
                      {/* consumir os valores do endpoint de titulacao da api */}
                      {modelosCurso?.map((item, index) => (
                        <SelectItem value={item} key={index}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="coordenadorId"
                    className="cadastro-form_label"
                  >
                    Coordenador
                  </label>
                  <Select
                    name="coordenadorId"
                    value={selectedProfessorId}
                    onValueChange={setSelectedProfessorId}
                    required
                  >
                    <SelectTrigger className="cadastro-form_select !w-full">
                      <SelectValue placeholder="Selecionar o coordenador"></SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {professors?.map((prof) => (
                        <SelectItem key={prof?.id} value={String(prof.id)}>
                          {prof.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seção de Matérias */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Matérias do Curso
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleOpenMateriaModal}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>

                  <MateriaList
                    materias={materias}
                    onEditMateria={handleEditMateria}
                    onRemoveMateria={handleRemoveMateria}
                  />
                </div>

                <Button>{isLoading ? "Atualizando..." : "Atualizar"}</Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Loader2 className="w-16 h-16 mb-4 animate-spin" />
            </div>
          )}
        </div>

        {/* Modal de Matérias */}
        <MateriaModal
          isOpen={isMateriaModalOpen}
          onClose={handleCloseMateriaModal}
          professors={professors || []}
          onAddMateria={handleAddMateria}
          editingMateria={editingMateria}
          onUpdateMateria={handleUpdateMateria}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CourseEditSheet;
