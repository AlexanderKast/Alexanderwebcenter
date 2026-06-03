import Link from 'next/link';
import { Plus, ArrowUpRight, Building2 } from 'lucide-react';
import { requireAuth } from '@/lib/auth';
import { getClients } from '@/lib/portal/actions';
import { NewClientButton } from './NewClientButton';

export const metadata = { title: 'Clientes · Admin Alexander Cast' };

export default async function AdminClientesPage() {
  await requireAuth();
  const clients = await getClients();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Portal</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Clientes</h1>
          <p className="mt-2 text-sm text-white/55">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NewClientButton />
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Building2 className="mx-auto w-10 h-10 text-white/20 mb-4" />
          <p className="text-white/40 text-sm">No hay clientes aún</p>
          <p className="text-white/25 text-xs mt-1">Crea el primer cliente para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clientes/${c.id}`}
              className="group rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5 transition-colors hover:border-[color:var(--gold-mid)]/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={c.nombre}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[color:var(--gold-mid)]/15 border border-[color:var(--gold-mid)]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[color:var(--gold-mid)] font-bold">
                        {c.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{c.nombre}</p>
                    {c.industria && (
                      <p className="text-xs text-white/40 truncate">{c.industria}</p>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--gold-mid)]" />
              </div>

              {c.contacto_email && (
                <p className="mt-4 text-xs text-white/40 truncate">{c.contacto_email}</p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    c.activo
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-600/30 bg-zinc-600/10 text-zinc-400'
                  }`}
                >
                  {c.activo ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-[11px] text-white/25">
                  {new Date(c.created_at).toLocaleDateString('es-CO')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
