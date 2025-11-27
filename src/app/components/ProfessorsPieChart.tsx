"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ProfessorsPieChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = [
  "#4D4D4F", // cinza institucional escuro
  "#000000", // preto (contraste)
  "#B5121B", // vermelho FATEC (cor principal)
  "#A6A6A6", // cinza claro
  "#CFCFCF", // cinza muito claro
  "#E5E5E5", // cinza neutro
];



const ProfessorsPieChart = ({ data }: ProfessorsPieChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Nenhum dado disponível para exibir</p>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    if (percent < 0.05) return null; // Não mostra label para fatias muito pequenas

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-4 sm:p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Professores por Titulação
        </h2>
        <p className="text-sm text-gray-600">
          Total de professores: <span className="font-semibold">{total}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px 16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [
              `${value} professores`,
              "Quantidade",
            ]}
            labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingTop: "24px",
              fontSize: "14px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {item.name}
              </p>
              <p className="text-sm font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfessorsPieChart;
