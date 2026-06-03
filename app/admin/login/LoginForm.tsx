"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "error";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError) throw authError;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-8"
    >
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Email
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

      <div className="space-y-2">
        <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Contraseña
        </label>
        <Input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 border-[color:var(--line)] bg-[color:var(--surface-2)] text-base"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold-metallic w-full"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <>
            <LogIn className="size-4" aria-hidden />
            Entrar
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
