import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import CourseEditSheet from "./CourseEditSheet";
import EnumType from "./EnumType";
import ProfessorEditSheet from "./ProfessorEditSheet";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionCellProps {
  data: { id: number };
  onDeleteFn: (id: number) => Promise<void>;
  onUpdateFn?: (id: number) => Promise<void>;
  type: EnumType;
}

export default function ActionCell({
  data,
  onDeleteFn,
  onUpdateFn,
  type,
}: ActionCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDeleteFn(id);
      toast.success("Excluído com sucesso!", {
        description: "O item foi removido permanentemente.",
      });
      router.refresh(); // Force page refresh to update the table
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Erro ao excluir", {
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (onUpdateFn) {
      try {
        await onUpdateFn(id);
        router.refresh(); // Force page refresh to update the table
      } catch (error) {
        console.error("Erro ao atualizar:", error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {type === EnumType.Course ? (
        <CourseEditSheet data={data} onUpdateFn={handleUpdate} />
      ) : (
        <ProfessorEditSheet data={data} onUpdateFn={handleUpdate} />
      )}

      <Button
        className="text-white"
        variant="destructive"
        onClick={() => handleDelete(data.id)}
        type="button"
        disabled={isDeleting}
        size="sm"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
