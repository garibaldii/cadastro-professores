import { Chat } from "@/components/ui/chat";
import { useState } from "react";

export function ChatBot() {
  const initialMenu =
    "Posso te ajudar com:\n" +
    "- **Cadastrar professores**\n" +
    "- **Cadastrar cursos**\n" +
    "- **Gerar relatório de professores**\n" +
    "- **Gerar relatório de cursos**\n" +
    "- **Gerar relatório de monitores**\n\n" +
    "Tudo isso está disponível na navbar da plataforma.\n\n" +
    "O que você deseja fazer?";

  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "system",
      content:
        "Olá! Sou seu assistente sobre cadastro e relatórios da plataforma.",
    },
    {
      id: "2",
      role: "assistant",
      content: initialMenu,
    },
  ]);

  const [input, setInput] = useState("");

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function sendMessage(role, content) {
    setMessages((prev) => [...prev, { id: String(Date.now()), role, content }]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const userMsg = input.trim();
    if (!userMsg) return;

    sendMessage("user", userMsg);

    const text = userMsg.toLowerCase();

    // === Cadastro de Professores ===
    if (
      text.includes("cadastrar professor") ||
      text.includes("cadastro professor") ||
      text.includes("cadastrar professores")
    ) {
      sendMessage(
        "assistant",
        "Para **cadastrar um professor**:\n" +
          "1. Vá até o menu **Professores** na navbar\n" +
          "2. Clique em **Cadastrar**\n" +
          "3. Preencha os dados solicitados\n" +
          "4. Clique em **Salvar**\n\n" +
          "Pronto! O professor será adicionado ao sistema."
      );

      // === Cadastro de Cursos ===
    } else if (
      text.includes("cadastrar curso") ||
      text.includes("cadastro curso") ||
      text.includes("cadastrar cursos")
    ) {
      sendMessage(
        "assistant",
        "Para **cadastrar um curso**:\n" +
          "1. Acesse o menu **Cursos** na navbar\n" +
          "2. Clique em **Cadastrar**\n" +
          "3. Preencha as informações do curso\n" +
          "4. Clique em **Salvar**\n\n" +
          "Seu curso estará disponível na lista."
      );

      // === Relatório professores ===
    } else if (
      text.includes("relatório professor") ||
      text.includes("relatorio professor") ||
      text.includes("gerar relatório de professores") ||
      text.includes("gerar relatorio de professores")
    ) {
      sendMessage(
        "assistant",
        "Para **gerar o relatório de professores**:\n" +
          "1. Acesse o menu **Professores**\n" +
          "2. Clique em **Relatório**\n" +
          "3. Clique em **Exportar Relatório**\n\n" +
          "Você verá todos os professores cadastrados."
      );

      // === Relatório cursos ===
    } else if (
      text.includes("relatório curso") ||
      text.includes("relatorio curso") ||
      text.includes("gerar relatório de cursos") ||
      text.includes("gerar relatorio de cursos")
    ) {
      sendMessage(
        "assistant",
        "Para **gerar o relatório de cursos**:\n" +
          "1. Acesse o menu **Cursos**\n" +
          "2. Clique em **Relatório**\n" +
          "3. Clique em **Exportar Relatório**\n\n" +
          "O sistema exibirá todos os cursos cadastrados."
      );

      // === Relatório monitores ===
    } else if (
      text.includes("relatório monitor") ||
      text.includes("relatorio monitor") ||
      text.includes("gerar relatório de monitores") ||
      text.includes("gerar relatorio de monitores")
    ) {
      sendMessage(
        "assistant",
        "Para **gerar relatório de monitores**:\n" +
          "1. Vá até o menu **Monitores** na navbar\n" +
          "2. Clique em **Exportar Relatório**\n\n" +
          "Você poderá ver todos os monitores ativos."
      );

    } else {
      sendMessage("assistant", "Por favor, selecione um item do menu.");
      sendMessage("assistant", initialMenu);
    }

    setInput("");
  }

  return (
    <Chat
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={false}
      stop={() => {}}
    />
  );
}
