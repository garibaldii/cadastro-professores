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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-lg rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-2 border-gray-200">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        {loading ? "Gerando relatório..." : title}
      </h1>

      <Button
        onClick={handleExport}
        className="font-medium px-4 sm:px-6 py-2 w-full sm:w-auto whitespace-nowrap"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Exportar Relatório"}
      </Button>
    </div>
  );
};
