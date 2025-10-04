"use client";

import ExcelProfessorRegister from "@/app/components/ExcelProfessorRegister";
import ProfessorForm from "@/app/components/ProfessorForm";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";

// Página dinâmica devido ao middleware de autenticação
export const dynamic = "force-dynamic";

const CadastroProfessor = () => {
  const [manualRegister, setManualRegister] = useState(true);

  return (
    <div>
      <section className="pink_container !min-h-[70px]">
        <h1 className="heading">Cadastre seu Professor</h1>
      </section>

      <div className="flex justify-center text-center space-x-2 w-full">
        <div>
          <h1 className="text-2xl">
            Clique aqui para alterar o tipo de cadastro
          </h1>
          <div className="flex-between">
            <label htmlFor="tipoForm">
              Cadastro Selecionado:{" "}
              <span className="font-bold">
                {manualRegister ? "Manual" : "Planilha Excel"}
              </span>
            </label>
            <Switch
              id="tipoForm"
              checked={manualRegister}
              onCheckedChange={setManualRegister}
            />
          </div>
        </div>
      </div>

      {manualRegister ? <ProfessorForm /> : <ExcelProfessorRegister />}
    </div>
  );
};

export default CadastroProfessor;
