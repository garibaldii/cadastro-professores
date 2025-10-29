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

const courseLabels: Record<string, string> = {
  nome: "Curso",
  codigo: "Código",
  coordenador: "Coordenador",
  cargaHoraria: "Carga Horária",
};

export const HeaderHtml = async () => {
  const session = await getSession();
  const imgSrc = `http://localhost:3000/static/cabecalho.png`;

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
