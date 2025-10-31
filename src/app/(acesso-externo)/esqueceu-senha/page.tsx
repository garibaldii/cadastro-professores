"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = "EMAIL" | "CODE" | "RESET";

export default function EsqueceuSenha() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) {
      toast.error("Informe seu e-mail");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/esqueceu-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.mensagem || "Falha ao enviar código");
      const token = data?.token as string | undefined;
      if (!token) throw new Error("Token de recuperação não recebido");
      setResetToken(token);
      setStep("CODE");
      toast.success("Código enviado para seu e-mail");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao solicitar código";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!resetToken) {
      toast.error("Token ausente. Solicite um novo código.");
      setStep("EMAIL");
      return;
    }
    if (!code || code.length < 4) {
      toast.error("Informe o código recebido");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verifica-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.mensagem || "Código inválido");
      toast.success("Código verificado com sucesso");
      setStep("RESET");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao verificar código";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetToken) {
      toast.error("Token ausente. Solicite um novo código.");
      setStep("EMAIL");
      return;
    }
    if (!novaSenha || novaSenha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resetar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ novaSenha, confirmarSenha }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.mensagem || "Não foi possível redefinir a senha");
      toast.success("Senha redefinida com sucesso. Faça login com a nova senha.");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao redefinir senha";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function goBackToEmail() {
    setStep("EMAIL");
    setCode("");
    setNovaSenha("");
    setConfirmarSenha("");
    setResetToken(null);
  }

  return (
    <Card className="w-full max-w-md bg-white p-6 shadow-lg">
      {step === "EMAIL" && (
        <form onSubmit={requestCode} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">Esqueceu sua senha?</h1>
            <p className="text-sm text-gray-600 mt-1">
              Informe seu e-mail para enviarmos um código de verificação.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar código"}
          </Button>
        </form>
      )}

      {step === "CODE" && (
        <form onSubmit={verifyCode} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">Verificar código</h1>
            <p className="text-sm text-gray-600 mt-1">
              Enviamos um código para <span className="font-medium">{email}</span>.
              Digite-o abaixo para continuar.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="Ex.: 123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={goBackToEmail} className="flex-1">
              Voltar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Verificando..." : "Verificar"}
            </Button>
          </div>
          <button
            type="button"
            onClick={() => requestCode()}
            className="text-sm text-blue-600 hover:underline"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Reenviando..." : "Reenviar código"}
          </button>
        </form>
      )}

      {step === "RESET" && (
        <form onSubmit={resetPassword} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">Definir nova senha</h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie uma nova senha para acessar sua conta.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="novaSenha">Nova senha</Label>
            <Input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep("CODE")} className="flex-1">
              Voltar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
