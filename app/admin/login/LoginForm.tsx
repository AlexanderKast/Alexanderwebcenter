"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (authError) throw authError;
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error al enviar el enlace");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-gold-metallic p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-[color:var(--gold-mid)]" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold text-white">
          Revisa tu correo
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Te enviamos un enlace mágico a{" "}
          <span className="font-medium text-[color:var(--gold-light)]">{email}</span>.
          Click y entras al admin.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-8"
    >
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Email del equipo
        </label>
        <Input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          placeholder="founder@kreoon.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 border-[color:var(--line)] bg-[color:var(--surface-2)] text-base"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-gold-metallic w-full"
      >
        {status === "sending" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <>
            <Mail className="size-4" aria-hidden />
            Enviar enlace mágico
          </>
        )}
      </button>

      {error ? (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      ) : null}

      <p className="text-xs text-white/40">
        Solo miembros registrados en <code className="rounded bg-white/5 px-1.5 py-0.5">admin_users</code> pueden entrar.
      </p>
    </form>
  );
}
