import React from "react";

import { DataTable } from "../../../components/data-table";
import { Course, courseColumns } from "./columns";
import { getCourses } from "@/lib/actions/index";

// Página dinâmica devido ao uso de cookies para autenticação
export const dynamic = "force-dynamic";

async function RelatorioCurso() {
  const courses: Course[] = await getCourses();

  return (
    <div className="p-3">
      <DataTable
        columns={courseColumns}
        data={courses}
        searchFields={["nome", "codigo", "sigla", "modelo", "coordenador"]}
      />
    </div>
  );
}

export default RelatorioCurso;
