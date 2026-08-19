import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createSupabaseServiceRole } from '@/lib/supabase/server';
import type { BriefEstado, BriefSubmission } from '@/types/brief';

export const dynamic = 'force-dynamic';

const ETIQUETA_ESTADO: Record<BriefEstado, string> = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  en_proceso: 'En proceso',
  archivado: 'Archivado',
};

const CLASE_ESTADO: Record<BriefEstado, string> = {
  nuevo: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  leido: 'border-white/15 bg-white/5 text-white/60',
  en_proceso: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  archivado: 'border-white/10 bg-white/[0.03] text-white/35',
};

function fecha(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  searchParams: Promise<{ estado?: string; q?: string }>;
}

export default async function BriefsPage({ searchParams }: Props) {
  await requireAuth();
  const { estado, q } = await searchParams;

  const supabase = createSupabaseServiceRole();
  let consulta = supabase
    .from('brief_submissions')
    .select(
      'id, cliente, marca, sector, contacto_nombre, contacto_email, contacto_tel, empresa, completado_pct, respondidas, total_campos, estado, notas, created_at, updated_at',
    )
    .order('created_at', { ascending: false })
    .limit(200);

  if (estado && estado in ETIQUETA_ESTADO) consulta = consulta.eq('estado', estado);
  if (q) {
    const patron = `%${q.replace(/[%_,]/g, '')}%`;
    consulta = consulta.or(
      `contacto_nombre.ilike.${patron},contacto_email.ilike.${patron},empresa.ilike.${patron},marca.ilike.${patron}`,
    );
  }

  const { data, error } = await consulta;

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
        Error al leer brief_submissions: {error.message}
        <p className="mt-2 text-red-300/70">
          ¿Corriste la migración <code>supabase/migrations/0005_brief_submissions.sql</code>?
        </p>
      </div>
    );
  }

  const briefs = (data ?? []) as BriefSubmission[];
  const sinLeer = briefs.filter((b) => b.estado === 'nuevo').length;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Briefs</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Formularios de marca
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {briefs.length} recibidos · {sinLeer} sin leer.
        </p>
      </header>

      <form method="get" className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar por nombre, correo, empresa o marca"
          maxLength={80}
          className="min-w-60 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
        />
        <select
          name="estado"
          defaultValue={estado ?? ''}
          aria-label="Estado"
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-white/30"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ETIQUETA_ESTADO).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
        >
          Filtrar
        </button>
      </form>

      {briefs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/40">
          Todavía no hay formularios con esos filtros.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-widest text-white/40">
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Completado</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Recibido</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((brief) => (
                <tr
                  key={brief.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span className="block font-medium text-white">
                      {brief.contacto_nombre || 'Sin nombre'}
                    </span>
                    {brief.empresa && (
                      <span className="block text-xs text-white/40">{brief.empresa}</span>
                    )}
                    {brief.contacto_email && (
                      <span className="block text-xs text-white/40">{brief.contacto_email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/70">{brief.marca}</td>
                  <td className="px-4 py-3">
                    <div
                      className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10"
                      title={`${brief.respondidas} de ${brief.total_campos}`}
                    >
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${brief.completado_pct}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-xs tabular-nums text-white/40">
                      {brief.completado_pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${CLASE_ESTADO[brief.estado]}`}
                    >
                      {ETIQUETA_ESTADO[brief.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">{fecha(brief.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/briefs/${brief.id}`}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/35 hover:text-white"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
