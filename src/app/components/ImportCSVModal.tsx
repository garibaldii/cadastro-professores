"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { Download, Upload, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadProfessorPlanilha } from "@/lib/actions/professor-actions";
import { toast } from "sonner";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportCSVModal = ({ isOpen, onClose }: ImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string>("");

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = `/planilha-modelo.xlsx`;
    link.download = "planilha-modelo.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors("");
    }
  };

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const result = await uploadProfessorPlanilha(formData);

      if (result.status === "ERROR") {
        setErrors(result.error);
        toast.error("Erro ao importar planilha", {
          description: result.error,
          position: "top-center",
        });
        return result;
      }

      toast.success("Planilha importada com sucesso!", {
        description: "Professores foram cadastrados com sucesso.",
        duration: 5000,
        position: "top-center",
      });

      // Resetar o formulário e fechar o modal
      setFile(null);
      setErrors("");
      onClose();

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setErrors(errorMessage);
      return { error: errorMessage, status: "ERROR" as const };
    }
  };

  const [, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "ERROR" as const,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-700">
            Importar Planilha de Professores
          </DialogTitle>
          <DialogDescription>
            Siga os passos abaixo para importar seus professores usando uma
            planilha Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center bg-white rounded-lg text-gray-800 overflow-hidden">
          {/* Bloco de Instruções */}
          <div className="flex-1 p-6 text-lg text-gray-700 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">· Primeiro Passo:</h3>
              <p className="mb-4">
                Clique no botão abaixo para baixar a planilha modelo e preencha
                os dados dos professores.
              </p>
              <Button
                className="w-full max-w-sm p-4 text-base bg-[#0086FF] hover:bg-[#3181c7]"
                onClick={() => handleDownloadFile()}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar planilha modelo
              </Button>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-3">· Segundo Passo:</h3>
              <p className="mb-4">
                Selecione a planilha preenchida com os dados dos professores.
              </p>

              <form action={formAction} className="space-y-4">
                <Input
                  type="file"
                  name="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="w-full max-w-sm"
                  required
                />

                {file && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Arquivo selecionado: {file.name}
                  </div>
                )}

                {errors && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="px-8 py-3 text-base bg-green-600 hover:bg-green-700"
                    disabled={!file || isLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isLoading ? "Importando..." : "Importar planilha"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="px-8 py-3 text-base"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Imagem à direita */}
          <div className="relative w-1/3 h-[400px] hidden md:block">
            <Image
              src="/excel.jpg"
              alt="Upload Illustration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSVModal;
