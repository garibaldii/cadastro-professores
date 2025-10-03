import CourseForm from '@/app/components/CourseForm'
import React from 'react'

const CadastroCurso = () => {
  return (
    <div>
      <section className='pink_container !min-h-[50px]'>
        <h1 className='heading'>Cadastre seu Curso</h1>
      </section>
      <CourseForm />
    </div>
  )
}

export default CadastroCurso