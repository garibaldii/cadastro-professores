import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getCourseById, getModeloCurso, getProfessors, updateCourse } from '@/lib/actions'
import { Pencil } from 'lucide-react'
import React, { useActionState, useEffect, useState } from 'react'
import { Course } from '../(root)/curso/relatorio/columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Professor } from '../(root)/professor/relatorio/columns'
import { toast } from 'sonner'


interface CourseEditSheetProps {
    data: { id: number },
    onUpdateFn?: (id: number) => Promise<void>
}


const CourseEditSheet = ({ data, onUpdateFn }: CourseEditSheetProps) => {
    const [course, setCourse] = useState<Course | null>(null)
    const [modelosCurso, setModelosCurso] = useState<string[]>()
    const [professors, setProfessors] = useState<Professor[]>()

    const [selectedProfessorId, setSelectedProfessorId] = useState<string>('')
    const [selectedModelo, setSelectedModelo] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            try {
                const [m, p, c] = await Promise.all([
                    getModeloCurso(),
                    getProfessors(),
                    getCourseById(data.id)
                ])

                setModelosCurso(m?.data || [])
                setProfessors(p || [])
                setCourse(c)

                if (c?.coordenador) {
                    setSelectedProfessorId(String(c.coordenador.id))
                }

                if (c?.modelo) {
                    setSelectedModelo(c.modelo)
                }


            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        }

        fetchData()
    }, [data.id])


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

            const result = await updateCourse(data.id, formValues)


            console.log(result)

            toast.success("Sucesso!", {
                description: "Dados atualizados com sucesso",
                duration: 4000,
                position: "top-center"
            })

            return result
        } catch (error: any) {
            toast.error("Erro", {
                description: error.message || "Erro inesperado do servidor",
                dismissible: true,
                position: "top-center"
            });
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
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Pencil />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Editar Curso
                    </SheetTitle>
                    <SheetDescription>
                        Faça suas alterações, clique em salvar quando finalizar
                    </SheetDescription>
                </SheetHeader>

                <form action={formAction}>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4 ">
                        <div className="flex w-full">

                            <div className='w-11/12 mr-3'>
                                <label htmlFor="nome" className='cadastro-form_label'>Nome</label>
                                <Input id="nome" name='nome' defaultValue={course?.nome} />
                            </div>

                            <div className='mr-3'>
                                <label htmlFor="sigla" className='cadastro-form_label'>Sigla</label>
                                <Input id="sigla" name='sigla' defaultValue={course?.sigla} />
                            </div>
                        </div>


                        <div className="">
                            <label htmlFor="codigo" className='cadastro-form_label'>Código</label>
                            <Input id="codigo" type='text' inputMode="numeric" maxLength={4} name='codigo' defaultValue={course?.codigo}
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement
                                    target.value = target.value.replace(/\D/g, "") // remove tudo que não for número
                                }} />
                        </div>


                        <div>
                            <label htmlFor="modelo" className='cadastro-form_label'>Modelo</label>
                            <Select
                                name="modelo"
                                value={selectedModelo}
                                onValueChange={setSelectedModelo}
                            >
                                <SelectTrigger className="cadastro-form_select !w-full" >
                                    <SelectValue placeholder="Selecionar o modelo de ensino" />
                                </SelectTrigger>

                                <SelectContent >
                                    {/* consumir os valores do endpoint de titulacao da api */}
                                    {modelosCurso?.map((item, index) => (
                                        <SelectItem
                                            value={item}
                                            key={index}
                                        >{item}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor='coordenadorId' className='cadastro-form_label'>Coordenador</label>
                            <Select
                                name="coordenadorId"
                                value={selectedProfessorId}
                                onValueChange={setSelectedProfessorId}
                            >
                                <SelectTrigger className="cadastro-form_select !w-full">
                                    <SelectValue placeholder="Selecionar o coordenador">
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {professors?.map((prof) => (
                                        <SelectItem key={prof?.id} value={String(prof.id)}>
                                            {prof.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                        <Button>{
                            isLoading ? "Atualizando..." : "Atualizar"}</Button>

                    </div>
                </form>
            </SheetContent>

        </Sheet >
    )
}

export default CourseEditSheet