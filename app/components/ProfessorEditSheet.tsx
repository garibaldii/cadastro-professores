import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getProfessorById, getReferencias, getStatusAtividade, getTitulacoes, updateCourse } from '@/lib/actions'
import { Pencil, Send } from 'lucide-react'
import React, { useActionState, useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Professor } from '../(root)/professor/relatorio/columns'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'


interface ProfessorEditSheetProps {
    data: { id: number },
    onUpdateFn?: (id: number) => Promise<void>
}


const ProfessorEditSheet = ({ data, onUpdateFn }: ProfessorEditSheetProps) => {

    const [professor, setProfessor] = useState<Professor | null>(null)

    const [titulacoes, setTitulacoes] = useState<string[]>()
    const [referencias, setReferencias] = useState<string[]>()
    const [statusAtividades, setStatusAtividade] = useState<string[]>()


    useEffect(() => {
        async function fetchData() {
            try {
                const [t, r, s, p] = await Promise.all([
                    getTitulacoes(),
                    getReferencias(),
                    getStatusAtividade(),
                    getProfessorById(data.id)
                ]);

                setTitulacoes(t?.data || []);
                setReferencias(r?.data || []);
                setStatusAtividade(s?.data || []);
                setProfessor(p)
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        }

        fetchData();
    }, [data.id]);


    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                nome: formData.get("nome") as string,
                email: formData.get("email") as string,
                titulacao: formData.get("titulacao") as string,
                idUnidade: formData.get("idUnidade") as string,
                referencia: formData.get("referencia") as string,
                lattes: formData.get("lattes") as string,
                statusAtividade: formData.get("statusAtividade") as string,
                observacoes: formData.get("observacoes") as string
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
        <Sheet >
            <SheetTrigger asChild>
                <Button>
                    <Pencil />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className='overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>
                        Editar Curso
                    </SheetTitle>
                    <SheetDescription>
                        Faça suas alterações, clique em salvar quando finalizar
                    </SheetDescription>
                </SheetHeader>

                <form action={formAction} >


                    <div className='cadastro-form_col-div'>
                        <label htmlFor='nome' className='cadastro-form_label'>Nome</label>
                        <Input
                            id="nome"
                            name='nome'
                            defaultValue={professor?.nome}
                            placeholder='Nome do Professor' />

                    </div>

                    <div >
                        <label htmlFor='email' className='cadastro-form_label'>Email</label>
                        <Input
                            id="email"
                            name='email'
                            type='email'
                            defaultValue={professor?.email}
                            placeholder='Endereço de E-mail' />

                    </div>


                    <div>
                        <label htmlFor='titulacao' className='cadastro-form_label'>Titulação</label>
                        <Select name="titulacao">

                            <SelectTrigger className="cadastro-form_select">
                                <SelectValue placeholder="Selecionar titulação" />
                            </SelectTrigger>

                            <SelectContent>
                                {/* consumir os valores do endpoint de titulacao da api */}
                                {titulacoes?.map((item: string, index: number) => (
                                    <SelectItem
                                        key={index}
                                        value={item}>{item}</SelectItem>

                                ))}

                            </SelectContent>
                        </Select>
                    </div>

                    <div >
                        <label htmlFor='referencia' className='cadastro-form_label'>Referência</label>
                        <Select name="referencia">
                            <SelectTrigger className="cadastro-form_select">
                                <SelectValue placeholder="Selecionar Referência" />
                            </SelectTrigger>

                            <SelectContent>
                                {/* consumir os valores do endpoint de titulacao da api */}
                                {referencias?.map((item: string, index: number) => (
                                    <SelectItem
                                        value={item}
                                        key={index}
                                    >{item}</SelectItem>
                                ))}

                            </SelectContent>
                        </Select>

                    </div>

                    <div>
                        <label htmlFor='statusAtividade' className='cadastro-form_label'>Status da Atividade</label>
                        <Select name="statusAtividade">
                            <SelectTrigger className="cadastro-form_select">
                                <SelectValue placeholder="Selecione o status do professor" />
                            </SelectTrigger>

                            <SelectContent>
                                {/* consumir os valores do endpoint de titulacao da api */}
                                {statusAtividades?.map((item: string, index: number) => (
                                    <SelectItem
                                        value={item}
                                        key={index}
                                    >{item}</SelectItem>
                                ))}

                            </SelectContent>
                        </Select>

                    </div>

                    <label htmlFor='lattes' className='cadastro-form_label'>Lattes</label>
                    <Input
                        id="lattes"
                        type='url'
                        name='lattes'
                        defaultValue={professor?.lattes}
                        placeholder='Url do Lattes'
                    />


                    <label htmlFor='idUnidade' className='cadastro-form_label'>ID da Unidade</label>

                    <Input
                        id="idUnidade"
                        name="idUnidade"
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        defaultValue={professor?.idUnidade}
                        placeholder="Digite o id da unidade respectiva"
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement
                            target.value = target.value.replace(/\D/g, "") // remove tudo que não for número
                        }}
                    />



                    <label htmlFor='observacoes' className='cadastro-form_label'>Observações</label>
                    <Textarea
                        id='observacoes'
                        name='observacoes'
                        placeholder={professor?.observacoes ? professor.observacoes : "Sem observações"}
                        defaultValue={professor?.observacoes}
                    />

                    <Button className='w-full' type='submit' disabled={isLoading}>
                        {isLoading ? 'Atualizando...' : 'Atualizar'}
                        <Send className='size-6 ml-2' />
                    </Button>


                </form >
            </SheetContent>

        </Sheet >
    )
}

export default ProfessorEditSheet