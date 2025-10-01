import React from 'react'

import { profColumns, Professor } from './columns'
import { DataTable } from './data-table'
import { getProfessors } from '@/lib/actions'

async function RelatorioProfessor() {

    const professors: Professor[] = await getProfessors()

    return (
        <div>
            <DataTable
                columns={profColumns}
                data={professors}
                searchFields={["nome", "email", "titulacao", "idUnidade", "referencia", "statusAtividade"]}
            />
        </div>
    )
}

export default RelatorioProfessor