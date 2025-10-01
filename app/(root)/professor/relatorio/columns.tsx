"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"

export type Professor = {
    id: string;
    nome: string;
    email: string;
    titulacao: string;
    idUnidade: string;
    referencia: string;
    lattes: string;
    statusAtividade: string;
    observacoes: string;
};


export const profColumns: ColumnDef<Professor>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "E-mail",
    },
    {
        accessorKey: "titulacao",
        header: "Titulação",
    },
    {
        accessorKey: "idUnidade",
        header: "Unidade",
    },
    {
        accessorKey: "referencia",
        header: "Referência",
    },
    {
        accessorKey: "lattes",
        header: "Lattes",
        cell: ({ row }) => (
            <a
                href={row.original.lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                Ver Currículo
            </a>
        ),
    },
    {
        accessorKey: "statusAtividade",
        header: "Status",
    },
    {
        header: "Ações",
        cell: ({ row }) => (
            <div>
                <Button>
                    Editar
                </Button>

                <Button>
                    Excluir
                </Button>
            </div>
        )
    }

];
