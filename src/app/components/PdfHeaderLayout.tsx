import { getSession } from "@/lib/actions/index";

// Labels personalizáveis

const professorLabels: Record<string, string> = {
  nome: "Nome",
  email: "Email",
  titulacao: "Titulação",
  idUnidade: "Unidade",
  referencia: "Referência",
  statusAtividade: "Status",
};

const monitorLabels: Record<string, string> = {
  nome: "Nome",
  email: "Email",
  tipo: "Tipo",
  professor: "Professor",
  cargaHorariaSemanal: "CH Semanal",
  status: "Status",
};

// Labels para relatório de ponto (registro de entrada/saída dos monitores)
// Campos espelhados do app mobile
const pontoLabels: Record<string, string> = {
  data: "Data",
  entrada: "Entrada",
  saida: "Saída",
  horasTrabalhadas: "Horas Trabalhadas",
};

export const monitorContent = (
  data: Record<string, unknown>[],
  headers: string[]
) => `
  <table>
    <thead>
      <tr>
        ${headers.map((key) => `<th>${monitorLabels[key] ?? key}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row) => `
        <tr>
          ${headers.map((key) => `<td>${row[key] ?? ""}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;

export const pontoContent = (
  data: Record<string, unknown>[],
  headers: string[],
  monitorInfo?: {
    nome: string;
    email: string;
    projeto: string;
    professor: string;
    cargaHoraria: string;
  },
  summary?: {
    totalRegistros: number;
    totalHoras: string;
    periodo: string;
  }
) => `
  ${monitorInfo ? `
    <div style="margin-bottom: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
      <p style="margin: 4px 0;"><strong>Monitor:</strong> ${monitorInfo.nome}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${monitorInfo.email}</p>
      <p style="margin: 4px 0;"><strong>Projeto:</strong> ${monitorInfo.projeto}</p>
      <p style="margin: 4px 0;"><strong>Professor:</strong> ${monitorInfo.professor}</p>
      <p style="margin: 4px 0;"><strong>Carga Horária:</strong> ${monitorInfo.cargaHoraria}h/semana</p>
    </div>
  ` : ''}
  
  <table>
    <thead>
      <tr style="background-color: #4CAF50;">
        ${headers.map((key) => `<th style="color: white; font-weight: bold;">${pontoLabels[key] ?? key}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row, idx) => `
        <tr style="${idx % 2 === 0 ? 'background-color: #f2f2f2;' : ''}">
          ${headers.map((key) => `<td>${row[key] ?? ""}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  
  ${summary ? `
    <div style="margin-top: 20px; padding: 10px; background-color: #e3f2fd; border-radius: 5px;">
      <p style="margin: 4px 0;"><strong>Total de Registros:</strong> ${summary.totalRegistros}</p>
      <p style="margin: 4px 0;"><strong>Total de Horas:</strong> ${summary.totalHoras}</p>
      <p style="margin: 4px 0;"><strong>Período:</strong> ${summary.periodo}</p>
    </div>
  ` : ''}
`;

const courseLabels: Record<string, string> = {
  nome: "Curso",
  codigo: "Código",
  coordenador: "Coordenador",
  cargaHoraria: "Carga Horária",
};

export const HeaderHtml = async () => {
  const session = await getSession();
  const imgSrc = `http://72.61.33.18:3000/static/cabecalho.png`;

  return `
    <header style="margin-bottom: 16px;">
      <div style="
        display: flex;
        font-family: Arial, sans-serif;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="width: 100%;">
          <img src="${imgSrc}" style="width: 50%; height: auto;" alt="Logo" />
        </div>

        <div style="
          width: 30%;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 10px;
        ">
          <p style="margin: 0; font-weight: bold; font-size: 14px;">${
            session?.nome ?? ""
          }</p>
          <p style="margin: 2px 0; font-weight: semibold;">Administração Geral</p>
          <p style="margin: 2px 0;">Centro Paula Souza</p>
          <p style="margin: 2px 0;">
            <span>${session?.email ?? ""}</span>
          </p>
        </div>
      </div>
      <h2 style="
        color: #b20000;
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0;
        font-family: Verdana, sans-serif;
        text-align: center;
      ">
        Faculdade de Tecnologia de Votorantim
      </h2>
    </header>
  `;
};

export const professorContent = (
  data: Record<string, unknown>[],
  headers: string[]
) => `
  <table>
    <thead>
      <tr>
        ${headers
          .map((key) => `<th>${professorLabels[key] ?? key}</th>`)
          .join("")}
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row) => `
        <tr>
          ${headers.map((key) => `<td>${row[key] ?? ""}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;

export const courseContent = (
// Removido bloco duplicado de monitorContent
  data: Record<string, unknown>[],
  headers: string[]
) => `
  <table>
    <thead>
      <tr>
        ${headers.map((key) => `<th>${courseLabels[key] ?? key}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row) => `
        <tr>
          ${headers.map((key) => `<td>${row[key] ?? ""}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;
