'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getModeloCurso, getProfessors, saveCourse } from '@/lib/actions'
import React, { useActionState, useEffect, useState } from 'react'
import { Professor } from '../(root)/professor/relatorio/columns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import z from 'zod'
import { createCourseSchema } from '@/lib/validation'
import { Send } from 'lucide-react'

const CourseForm = () => {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [modelosCurso, setModelosCurso] = useState<string[]>()
  const [professors, setProfessors] = useState<Professor[]>()



  useEffect(() => {
    async function fetchData() {
      try {
        const [m, p] = await Promise.all([
          getModeloCurso(),
          getProfessors()
        ])

        setModelosCurso(m?.data || [])
        setProfessors(p || [])

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {

      const formValues = {
        nome: formData.get("nome") as string,
        codigo: formData.get("codigo") as string,
        sigla: formData.get("sigla") as string,
        modelo: formData.get("modelo") as string,
        coordenadorId: Number(formData.get("coordenadorId"))
      }

      console.log(formValues)

      await createCourseSchema.parseAsync(formValues)

      const result = await saveCourse(formValues)

      toast("Curso cadastrado com sucesso!", {
        description: "Direcionando para a lista de Cursos...",
        duration: 5000,
        position: "top-center"
      })

      router.push("/curso/relatorio")

      console.log(result)

      return result
    } catch (error: any) {



      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors

        setErrors(fieldErrors as unknown as Record<string, string>)
      } else {
        toast.error("Erro", {
          description: error.message || "Erro inesperado do servidor",
          dismissible: true,
        });

        console.log(JSON.stringify(error))

      }
    } finally {

    }
  }

  const [state, formAction, isLoading] = useActionState(handleFormSubmit,
    {
      error: '',
      status: "INITIAL",
    }
  );

  return (
    <form action={formAction} className='cadastro-form'>

      <div className='flex w-full'>
        <div className='w-3/4 mr-3'>
          <label htmlFor='nome' className='cadastro-form_label'>Nome</label>
          <Input
            id="nome"
            name='nome'
            required
            placeholder='Nome do curso' />
          {errors.nome && <p className="startup-form_error">{errors.nome}</p>}
        </div>

        <div className='mr-3'>
          <label htmlFor='sigla' className='cadastro-form_label'>Sigla</label>
          <Input
            id="sigla"
            name='sigla'
            required
            placeholder='ex: DSM' />
          {errors.sigla && <p className="startup-form_error">{errors.sigla}</p>}
        </div>

        <div>
          <label htmlFor='codigo' className='cadastro-form_label'>Código</label>
          <Input
            id="codigo"
            name='codigo'
            type='text'
            inputMode="numeric"
            maxLength={4}
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              target.value = target.value.replace(/\D/g, "") // remove tudo que não for número
            }}
            required
            placeholder='ex: 301' />
          {errors.codigo && <p className="startup-form_error">{errors.codigo}</p>}
        </div>

      </div>


      <div>
        <label htmlFor='modelo' className='cadastro-form_label'>Modelo de Ensino</label>
        <Select name="modelo">
          <SelectTrigger className="cadastro-form_select !w-full">
            <SelectValue placeholder="Selecionar o modelo de ensino" />
          </SelectTrigger>

          <SelectContent>
            {/* consumir os valores do endpoint de titulacao da api */}
            {modelosCurso?.map((item: string, index: number) => (
              <SelectItem
                value={item}
                key={index}
              >{item}</SelectItem>
            ))}

          </SelectContent>
        </Select>
        {errors.modelo && <p className="startup-form_error">{errors.modelo}</p>}
      </div>

      <div>
        <label htmlFor='coordenadorId' className='cadastro-form_label'>Coordenador</label>
        <Select
          name="coordenadorId"
        >
          <SelectTrigger className="cadastro-form_select !w-full">
            <SelectValue placeholder="Selecionar o coordenador">
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {professors?.map((prof) => (
              <SelectItem key={prof.id} value={String(prof.id)}>
                {prof.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.coordenadorId && <p className="startup-form_error">{errors.coordenadorId}</p>}
      </div>




      <Button className='w-full' type='submit' disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        <Send className='size-6 ml-2' />
      </Button>


    </form >
  )
}

export default CourseForm