"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { shareDataToPdfFile } from "@/app/components/PdfBodyLayout";

type RelatoryActionsProps = {
  title: string;
  data: Record<string, unknown>[];
  type: "professor" | "course";
  selectedColumns: string[];
};

export const RelatoryActions = ({
  title,
  data,
  type,
  selectedColumns,
}: RelatoryActionsProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await shareDataToPdfFile(data, type, selectedColumns);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-xl px-6 py-4 border mb-6">
      <h1 className="text-xl font-semibold text-gray-800">
        {loading ? "Gerando relatório..." : title}
      </h1>

      <Button onClick={handleExport} className="font-medium" disabled={loading}>
        {loading ? "Carregando..." : "Exportar Relatório"}
      </Button>
    </div>
  );
};
