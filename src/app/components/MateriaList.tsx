"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Trash2, BookOpen } from "lucide-react";
import { Materia } from "./MateriaModal";

interface MateriaListProps {
  materias: Materia[];
  onEditMateria: (materia: Materia) => void;
  onRemoveMateria: (index: number) => void;
}

const MateriaList = ({
  materias,
  onEditMateria,
  onRemoveMateria,
}: MateriaListProps) => {
  if (materias.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          Nenhuma matéria adicionada ainda
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Clique no botão &ldquo;Adicionar Matéria&rdquo; para começar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-700 mb-3">
        Matérias do Curso ({materias.length})
      </h3>

      {materias.map((materia, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900 text-lg">
                  {materia.nome}
                </h4>
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  <p>
                    <span className="font-medium">Carga Horária:</span>{" "}
                    {materia.cargaHoraria}h
                  </p>
                  <p>
                    <span className="font-medium">Professor:</span>{" "}
                    {materia.professor?.nome || "Professor não encontrado"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onEditMateria(materia)}
                  className="p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveMateria(index)}
                  className="p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MateriaList;
