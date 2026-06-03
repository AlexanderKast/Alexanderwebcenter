'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function PortalLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        return;
      }
      router.push('/portal');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1.5">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !email || !password}
        className="w-full rounded-xl bg-[#D4AF37] py-3 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors mt-2"
      >
        {isPending ? 'Entrando...' : 'Entrar al portal'}
      </button>

      <p className="text-center text-xs text-white/25 mt-4">
        ¿No tienes acceso?{' '}
        <a
          href="mailto:founder@kreoon.com"
          className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
        >
          Escríbele a Alexander
        </a>
      </p>
    </form>
  );
}
