'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import { createClient } from '@/lib/portal/actions';
import { useRouter } from 'next/navigation';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function NewClientButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [industria, setIndustria] = useState('');
  const [email, setEmail] = useState('');
  const [contacto, setContacto] = useState('');
  const [error, setError] = useState('');

  function handleNombreChange(v: string) {
    setNombre(v);
    if (!slug || slug === slugify(nombre)) {
      setSlug(slugify(v));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!nombre.trim() || !slug.trim()) return;
    startTransition(async () => {
      const result = await createClient({
        nombre: nombre.trim(),
        slug: slug.trim(),
        industria: industria || undefined,
        contacto_email: email || undefined,
        contacto_nombre: contacto || undefined,
      });
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push(`/admin/clientes/${result.id}`);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-[color:var(--gold-mid)] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[color:var(--gold-light)] transition-colors"
      >
        <Plus className="w-4 h-4" /> Nuevo cliente
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">Nuevo cliente</h2>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
              Nombre *
            </label>
            <input
              value={nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              placeholder="Agencia Infiny 360"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
              Slug (URL) *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">/portal/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="agencia-infiny-360"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
                Industria
              </label>
              <input
                value={industria}
                onChange={(e) => setIndustria(e.target.value)}
                placeholder="Marketing digital"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
                Contacto
              </label>
              <input
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre del contacto"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
              Email del cliente
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@empresa.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || !nombre.trim() || !slug.trim()}
              className="flex-1 rounded-xl bg-[#D4AF37] py-2.5 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors"
            >
              {isPending ? 'Creando...' : 'Crear cliente'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
