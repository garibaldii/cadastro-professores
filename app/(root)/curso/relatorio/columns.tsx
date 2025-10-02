'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Professor } from "../../professor/relatorio/columns";
import ActionCell from "@/app/components/ActionCell";
import { deleteCourse } from "@/lib/actions";
import EnumType from "@/app/components/EnumType";

export type Course = {
    id: number;
    nome: string,
    codigo: string,
    sigla: string,
    modelo: string,
    coordenador: Professor
}

export const courseColumns: ColumnDef<Course>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "codigo",
        header: "Código"
    },
    {
        accessorKey: "sigla",
        header: "Sigla"
    },
    {
        accessorKey: "modelo",
        header: "Modelo"
    },
    {
        accessorKey: "coordenador.nome",
        header: "Coordenador"
    },

    {
        header: "Ações",
        cell: ({ row }) => <ActionCell
            data={row.original}
            onDeleteFn={deleteCourse}
            type={EnumType.Course}
        />
    }
]