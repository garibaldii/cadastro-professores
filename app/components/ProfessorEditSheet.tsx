import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getProfessorById,
  getReferencias,
  getStatusAtividade,
  getTitulacoes,
  updateProfessor,
} from "@/lib/actions";
import { Pencil, Send } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Professor } from "../(root)/professor/relatorio/columns";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import { Loader2 } from "lucide-react";
import { updateProfessorSchema } from "@/lib/validation";

interface ProfessorEditSheetProps {
  data: { id: number };
  onUpdateFn?: (id: number) => Promise<void>;
}

const ProfessorEditSheet = ({ data, onUpdateFn }: ProfessorEditSheetProps) => {
  //variáveis para configurarmos a visibilidade do Sheet
  const [isOpen, setIsOpen] = useState(false);

  //Objeto que vamos trabalhar
  const [professor, setProfessor] = useState<Professor | null>(null);

  //chamadas na api
  const [titulacoes, setTitulacoes] = useState<string[]>();
  const [referencias, setReferencias] = useState<string[]>();
  const [statusAtividades, setStatusAtividade] = useState<string[]>();

  //pegar o selecionado
  const [selectedTitulacao, setSelectedTitulacao] = useState<string>();
  const [selectedReferencia, setSelectedReferencia] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        const [t, r, s, p] = await Promise.all([
          getTitulacoes(),
          getReferencias(),
          getStatusAtividade(),
          getProfessorById(data.id),
        ]);

        setTitulacoes(t?.data || []);
        setReferencias(r?.data || []);
        setStatusAtividade(s?.data || []);
        setProfessor(p);

        setSelectedTitulacao(p.titulacao);
        setSelectedReferencia(p.referencia);
        setSelectedStatus(p.statusAtividade);
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
        observacoes: formData.get("observacoes") as string,
      };

      await updateProfessorSchema.parseAsync(formValues);

      console.log(formValues);

      const result = await updateProfessor(data.id, formData);

      console.log(result);

      toast.success("Sucesso!", {
        description: "Dados atualizados com sucesso",
        duration: 4000,
        position: "top-center",
      });

      setIsOpen(false);

      return result;
    } catch (error: any) {
      toast.error("Erro", {
        description: error.message || "Erro inesperado do servidor",
        dismissible: true,
        position: "top-center",
      });
    }
  };

  const [state, formAction, isLoading] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Pencil />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Professor</SheetTitle>
          <SheetDescription>
            Faça suas alterações, clique em salvar quando finalizar
          </SheetDescription>
        </SheetHeader>

        {professor ? (
          <form action={formAction} className="cadastro-form !shadow-none">
            <div className="flex gap-4">
              <div className="flex-2">
                <label htmlFor="nome" className="cadastro-form_label">
                  Nome
                </label>
                <Input
                  id="nome"
                  name="nome"
                  required
                  defaultValue={professor?.nome}
                  placeholder="Nome do Professor"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="idUnidade" className="cadastro-form_label">
                  ID da Unidade
                </label>
                <Input
                  id="idUnidade"
                  name="idUnidade"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={5}
                  defaultValue={professor?.idUnidade}
                  placeholder="Digite o id da unidade respectiva"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, ""); // remove tudo que não for número
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="cadastro-form_label">
                Email
              </label>
              <Input
                id="email"
                name="email"
                required
                type="email"
                defaultValue={professor?.email}
                placeholder="Endereço de E-mail"
              />
            </div>

            <div className="flex ">
              <div className="w-1/2">
                <label htmlFor="titulacao" className="cadastro-form_label">
                  Titulação
                </label>
                <Select
                  name="titulacao"
                  value={selectedTitulacao}
                  required
                  onValueChange={setSelectedTitulacao}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar titulação" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* consumir os valores do endpoint de titulacao da api */}
                    {titulacoes?.map((item: string, index: number) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2 ml-2">
                <label htmlFor="referencia" className="cadastro-form_label">
                  Referência
                </label>
                <Select
                  name="referencia"
                  value={selectedReferencia}
                  required
                  onValueChange={setSelectedReferencia}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Referência" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* consumir os valores do endpoint de titulacao da api */}
                    {referencias?.map((item: string, index: number) => (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="statusAtividade" className="cadastro-form_label">
                Status da Atividade
              </label>
              <Select
                name="statusAtividade"
                value={selectedStatus}
                required
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status do professor" />
                </SelectTrigger>

                <SelectContent>
                  {/* consumir os valores do endpoint de titulacao da api */}
                  {statusAtividades?.map((item: string, index: number) => (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <label htmlFor="lattes" className="cadastro-form_label">
              Lattes
            </label>
            <Input
              id="lattes"
              type="url"
              name="lattes"
              required
              defaultValue={professor?.lattes}
              placeholder="Url do Lattes"
            />

            <label htmlFor="observacoes" className="cadastro-form_label">
              Observações
            </label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder={
                professor?.observacoes
                  ? professor.observacoes
                  : "Sem observações"
              }
              defaultValue={professor?.observacoes}
            />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar"}
              <Send className="size-6 ml-2" />
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Loader2 className="w-16 h-16 mb-4 animate-spin" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProfessorEditSheet;
