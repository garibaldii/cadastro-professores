import { getProfessors } from "@/lib/actions/index";
import ProfessorsPieChart from "@/app/components/ProfessorsPieChart";

// Página dinâmica devido ao middleware de autenticação
export const dynamic = "force-dynamic";

const COLORS = [
  "#64748B", // slate
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#EC4899", // pink
];

interface Professor {
  id: number;
  nome: string;
  email: string;
  titulacao: string;
  idUnidade: string;
  referencia: string;
  lattes: string;
  statusAtividade: string;
  observacoes: string | null;
}

export default async function Home() {
  const professors: Professor[] = await getProfessors();

  // Agrupa professores por titulação
  const titulacaoCount = professors.reduce((acc, professor) => {
    const titulacao = professor.titulacao || "Não informado";
    acc[titulacao] = (acc[titulacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Converte para o formato do gráfico
  const chartData = Object.entries(titulacaoCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Ordena por quantidade (maior primeiro)

  // Calcula estatísticas adicionais
  const ativos = professors.filter((p) => p.statusAtividade === "ATIVO").length;
  const professoresPorUnidade = professors.reduce((acc, professor) => {
    const unidade = professor.idUnidade || "Não informado";
    acc[unidade] = (acc[unidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const unidadesCount = Object.keys(professoresPorUnidade).length;

  return (
    <div className="page-container">
      <h1 className="heading mb-8">Secretaria</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">
            Total de Professores
          </h3>
          <p className="text-4xl font-bold">{professors.length}</p>
          <p className="text-sm opacity-80 mt-2">Cadastrados no sistema</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">
            Professores Ativos
          </h3>
          <p className="text-4xl font-bold">{ativos}</p>
          <p className="text-sm opacity-80 mt-2">
            {professors.length > 0
              ? ((ativos / professors.length) * 100).toFixed(1)
              : 0}
            % do total
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90 mb-2">
            Unidades Atendidas
          </h3>
          <p className="text-4xl font-bold">{unidadesCount}</p>
          <p className="text-sm opacity-80 mt-2">Diferentes unidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <ProfessorsPieChart data={chartData} />

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ranking de Titulações
          </h3>
          <div className="space-y-3">
            {chartData.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.value / professors.length) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                      {item.value} (
                      {((item.value / professors.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 5 && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              + {chartData.length - 5} outras titulações
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
