import React from "react";

import { profColumns, Professor } from "./columns";
import { DataTable } from "../../../components/data-table";
import { getProfessors } from "@/lib/actions/index";
import { RelatoryActions } from "@/app/components/RelatoryAction";

export const dynamic = "force-dynamic";

async function RelatorioProfessor() {
  const professors: Professor[] = await getProfessors();

  // Define colunas que quer exportar
  const selectedColumns = [
    "nome",
    "email",
    "titulacao",
    "idUnidade",
    "referencia",
    "statusAtividade",
  ];

  return (
    <div className="table-container">
      <RelatoryActions
        title="Relatório de Professores"
        data={professors}
        selectedColumns={selectedColumns}
        type="professor"
      />

      <DataTable
        columns={profColumns}
        data={professors}
        searchFields={selectedColumns}
      />
    </div>
  );
}

export default RelatorioProfessor;
