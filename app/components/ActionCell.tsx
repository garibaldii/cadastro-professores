
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash } from 'lucide-react'
import CourseEditSheet from './CourseEditSheet'
import EnumType from './EnumType'
import ProfessorEditSheet from './ProfessorEditSheet'

interface ActionCellProps {
    data: { id: number }
    onDeleteFn: (id: number) => Promise<void>
    type: EnumType
}

export default function ActionCell({ data, onDeleteFn, type }: ActionCellProps) {

    const handleDelete = async (id: number) => {
        try {
            await onDeleteFn(id)
            toast.success("Excluído com sucesso!")

        } catch (error: any) {
            toast.error(error.message || 'Erro inesperado')
        }
    }


    return (
        <div className="flex items-center">

            {type === EnumType.Course ? <CourseEditSheet data={data} /> : <ProfessorEditSheet data={data} />}
            {/* <EditSheet data={data} /> sem <div> extra */}
            <Button
                className='ml-2 w-1/6 text-white'
                variant='destructive'
                onClick={() => handleDelete(data.id)}
                type="button"
            >
                <Trash />
            </Button>
        </div>
    )

}
