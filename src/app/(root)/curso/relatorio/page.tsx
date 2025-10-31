import React from "react";

import { DataTable } from "../../../components/data-table";
import { Course, courseColumns } from "./columns";
import { getCourses } from "@/lib/actions/index";
import { RelatoryActions } from "@/app/components/RelatoryAction";

// Página dinâmica devido ao uso de cookies para autenticação
export const dynamic = "force-dynamic";

async function RelatorioCurso() {
  const courses: Course[] = await getCourses();

  const selectedColumns = [
    "nome",
    "codigo",
    "sigla",
    "modelo",
  ];

  return (
    <div className="table-container">
      <RelatoryActions
        title="Relatório de Cursos"
        data={courses}
        selectedColumns={selectedColumns}
        type="course"
      />

      <DataTable
        columns={courseColumns}
        data={courses}
        searchFields={["nome", "codigo", "sigla", "modelo", "coordenador"]}
      />
    </div>
  );
}

export default RelatorioCurso;
