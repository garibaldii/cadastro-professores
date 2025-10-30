"use client";

import ProfessorForm from "@/app/components/ProfessorForm";
import ImportModal from "@/app/components/ImportCSVModal";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import React, { useState } from "react";

// Página dinâmica devido ao middleware de autenticação
export const dynamic = "force-dynamic";

const CadastroProfessor = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div>
      <section className="pink_container !min-h-[70px]">
        <h1 className="heading">Cadastre seu Professor</h1>
      </section>

      <div className="form-page-container">
        <div className="flex justify-center items-center mb-6">
          <div className="text-center">
            <div className="p-5 border-2 rounded-lg bg-green-50 border-green-200 shadow-sm">
              <h3 className="font-semibold mb-2 text-gray-800">
                Importação em Lote
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Importe vários professores usando planilha Excel
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setIsImportModalOpen(true)}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Importar CSV
              </Button>
            </div>
          </div>
        </div>

        <div id="professor-form">
          <ProfessorForm />
        </div>

        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CadastroProfessor;
