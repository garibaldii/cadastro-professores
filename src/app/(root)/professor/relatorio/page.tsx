import React from "react";

import { profColumns, Professor } from "./columns";
import { DataTable } from "../../../components/data-table";
import { getProfessors } from "@/lib/actions/index";

// Página dinâmica devido ao uso de cookies para autenticação
export const dynamic = 'force-dynamic';

async function RelatorioProfessor() {
  const professors: Professor[] = await getProfessors();

  console.log(professors);
  return (
    <div className="p-3">
      <DataTable
        columns={profColumns}
        data={professors}
        searchFields={[
          "nome",
          "email",
          "titulacao",
          "idUnidade",
          "referencia",
          "statusAtividade",
        ]}
      />
    </div>
  );
}

export default RelatorioProfessor;
