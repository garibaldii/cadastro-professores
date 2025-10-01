import z from 'zod'

//Usuário
export const createUserSchema = z.object({
  nome: z.string()
    .max(50, 'Nome deve ter no máximo 50 caracteres'),

  email: z.string()
    .email('Email inválido'),

  senha: z.string()
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, 'Senha deve conter pelo menos uma letra maiúscula e um caractere especial')
});


//Professor

export const createProfessorSchema = z.object({
    nome: z.string()
        .max(50, 'Nome deve ter no máximo 50 caracteres')
        .regex(/^[A-Za-zÀ-ú\s]+$/, 'Nome deve conter apenas letras'),

    email: z.string()
        .email('Email inválido'),

    titulacao: z.enum(['DOUTOR', 'MESTRE', 'ESPECIALISTA'], {
        error: () => ({ message: 'Titulação Inválida' })
    }),

    idUnidade: z.coerce.string()
        .min(1, 'ID da unidade deve ter no mínimo 1 caractere')
        .max(5, 'ID da unidade deve ter no máximo 5 caracteres')
        .regex(/^\d+$/, 'ID da unidade deve conter apenas números'),

    referencia: z.string()
        .regex(/^PES_(I|II|III)_[A-H]$/, 'Formato de referência inválido'),

    lattes: z.string()
        .regex(
            /^(https?:\/\/)?lattes\.cnpq\.br\/[A-Za-z0-9]+$/,
            'URL do Lattes deve ser no formato lattes.cnpq.br/[identificador]'
        ),

    statusAtividade: z.enum(['ATIVO', 'AFASTADO', 'LICENCA', 'NAO_ATIVO'], {
        error: () => ({ message: 'Status de atividade inválido' })
    }),

    observacoes: z.string().optional()
});
export const updateProfessorSchema = createProfessorSchema.partial();
