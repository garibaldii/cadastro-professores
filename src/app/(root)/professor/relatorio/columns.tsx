"use client";

import ActionCell from "@/app/components/ActionCell";
import EnumType from "@/app/components/EnumType";
import { deleteProfessor } from "@/lib/actions/index";
import { ColumnDef } from "@tanstack/react-table";

export type Professor = {
  id: number;
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
      <ActionCell
        data={row.original}
        onDeleteFn={deleteProfessor}
        onUpdateFn={async () => {
          // The update will be handled by revalidatePath in the action
        }}
        type={EnumType.Professor}
      />
    ),
  },
];
