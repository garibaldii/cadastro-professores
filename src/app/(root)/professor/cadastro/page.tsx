import ProfessorForm from '@/app/components/ProfessorForm'
import React from 'react'

// Página dinâmica devido ao middleware de autenticação
export const dynamic = 'force-dynamic';

const CadastroProfessor = () => {
  return (
    <div>
      <section className='pink_container !min-h-[50px]'>
        <h1 className='heading'>Cadastre seu Professor</h1>
      </section>
      <ProfessorForm />
    </div>
  )
}

export default CadastroProfessor