import z from "zod";

//Usuário
export const createUserSchema = z.object({
  nome: z.string().max(50, "Nome deve ter no máximo 50 caracteres"),

  email: z.string().email("Email inválido"),

  senha: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "Senha deve conter pelo menos uma letra maiúscula e um caractere especial"
    ),
});

//Professor

export const createProfessorSchema = z.object({
  nome: z
    .string()
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .regex(/^[A-Za-zÀ-ú\s]+$/, "Nome deve conter apenas letras"),

  email: z.string().email("Email inválido"),

  titulacao: z.enum(["DOUTOR", "MESTRE", "ESPECIALISTA"], {
    error: () => ({ message: "Titulação Inválida" }),
  }),

  idUnidade: z.coerce
    .string()
    .min(1, "ID da unidade deve ter no mínimo 1 caractere")
    .max(5, "ID da unidade deve ter no máximo 5 caracteres")
    .regex(/^\d+$/, "ID da unidade deve conter apenas números"),

  referencia: z
    .string()
    .regex(/^PES_(I|II|III)_[A-H]$/, "Formato de referência inválido"),

  lattes: z
    .string()
    .regex(
      /^(https?:\/\/)?lattes\.cnpq\.br\/[A-Za-z0-9]+$/,
      "URL do Lattes deve ser no formato lattes.cnpq.br/[identificador]"
    ),

  statusAtividade: z.enum(["ATIVO", "AFASTADO", "LICENCA", "NAO_ATIVO"], {
    error: () => ({ message: "Status de atividade inválido" }),
  }),

  observacoes: z.string().optional(),
});
export const updateProfessorSchema = createProfessorSchema.partial();

//Curso
export const createCourseSchema = z.object({
  nome: z.string().max(100, "Nome deve ter no máximo 100 caracteres"),

  codigo: z
    .string()
    .regex(/^\d{1,4}$/, "Código deve conter até 4 algarismos numéricos"),

  sigla: z
    .string()
    .min(1, "Sigla deve ter no mínimo 1 caractere")
    .max(4, "Sigla deve ter no máximo 4 caracteres")
    .regex(/^[A-Za-z]+$/, "Sigla deve conter apenas letras"),

  modelo: z.enum(["PRESENCIAL", "HIBRIDO", "EAD"], {
    error: () => ({ message: "Modelo inválido" }),
  }),

  coordenadorId: z.number().int("CoordenadorId deve ser um número inteiro"),

  materias: z
    .array(
      z.object({
        nome: z
          .string()
          .max(100, "Nome da matéria deve ter no máximo 100 caracteres"),
        cargaHoraria: z
          .number()
          .int("Carga horária deve ser um número inteiro"),
        professorId: z.number().int("ProfessorId deve ser um número inteiro"),
      })
    )
    .optional(),
});

// Matéria
export const createMateriaSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  cargaHoraria: z.coerce
    .number()
    .int("Carga horária deve ser um número inteiro")
    .min(1, "Carga horária deve ser maior que zero")
    .max(1000, "Carga horária deve ser no máximo 1000 horas"),

  professorId: z.coerce
    .number()
    .int("Professor deve ser selecionado")
    .min(1, "Professor é obrigatório"),

  cursos: z
    .array(
      z.object({
        cursoId: z.number().int("ID do curso deve ser um número inteiro"),
      })
    )
    .optional(),
});

export const updateMateriaSchema = createMateriaSchema.partial();
