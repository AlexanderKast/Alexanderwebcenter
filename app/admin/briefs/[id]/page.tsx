import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { requireAuth } from '@/lib/auth';
import { createSupabaseServiceRole } from '@/lib/supabase/server';
import { conMarca, seccionesPara } from '@/lib/brief/schema';
import type { BriefEstado, BriefSubmission } from '@/types/brief';
import { cambiarEstadoBrief, guardarNotasBrief } from '../actions';

export const dynamic = 'force-dynamic';

const ETIQUETA_ESTADO: Record<BriefEstado, string> = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  en_proceso: 'En proceso',
  archivado: 'Archivado',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BriefDetallePage({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  const supabase = createSupabaseServiceRole();

  const [cabecera, respuestas] = await Promise.all([
    supabase.from('brief_submissions').select('*').eq('id', id).maybeSingle(),
    supabase.from('brief_answers').select('campo_id, valor').eq('submission_id', id),
  ]);

  if (cabecera.error || !cabecera.data) notFound();

  const brief = cabecera.data as BriefSubmission & {
    payload?: { valores?: Record<string, string> };
  };

  // Preferimos las filas sueltas; si faltan, reconstruimos desde el payload.
  const valores: Record<string, string> = {};
  for (const fila of respuestas.data ?? []) {
    valores[fila.campo_id as string] = (fila.valor as string) ?? '';
  }
  if (Object.keys(valores).length === 0 && brief.payload?.valores) {
    Object.assign(valores, brief.payload.valores);
  }

  const secciones = seccionesPara(brief.sector);

  return (
    <div className="space-y-8">
      <Link
        href="/admin/briefs"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Volver a los briefs
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div>
          <p className="eyebrow">{brief.marca}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white">
            {brief.contacto_nombre || 'Sin nombre'}
          </h1>
          {brief.empresa && <p className="mt-1 text-sm text-white/50">{brief.empresa}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/60">
            {brief.contacto_email && (
              <a
                href={`mailto:${brief.contacto_email}`}
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {brief.contacto_email}
              </a>
            )}
            {brief.contacto_tel && (
              <a
                href={`https://wa.me/${brief.contacto_tel.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {brief.contacto_tel}
              </a>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-semibold text-yellow-400">{brief.completado_pct}%</p>
          <p className="text-xs text-white/40">
            {brief.respondidas} de {brief.total_campos} respuestas
          </p>
          <p className="mt-1 text-xs text-white/30">
            {new Date(brief.created_at).toLocaleString('es-CO')}
          </p>
        </div>
      </header>

      <form
        action={cambiarEstadoBrief}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
      >
        <input type="hidden" name="id" value={brief.id} />
        <label htmlFor="estado" className="text-sm font-medium text-white/60">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          defaultValue={brief.estado}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-white/30"
        >
          {Object.entries(ETIQUETA_ESTADO).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
        >
          Guardar estado
        </button>
      </form>

      {secciones.map((seccion) => {
        const visibles = seccion.f.filter((campo) => campo.id in valores);
        if (visibles.length === 0) return null;
        const llenos = visibles.filter((campo) => (valores[campo.id] ?? '').trim()).length;

        return (
          <section
            key={seccion.n}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h2 className="flex items-center gap-3 border-b border-white/10 pb-3 text-lg font-semibold text-white">
              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-yellow-400/10 px-2 text-xs font-bold text-yellow-400">
                {seccion.n}
              </span>
              {conMarca(seccion.t, brief.marca)}
              <span className="ml-auto text-xs font-normal tabular-nums text-white/35">
                {llenos}/{visibles.length}
              </span>
            </h2>

            <dl className="mt-4 space-y-4">
              {visibles.map((campo) => {
                const valor = (valores[campo.id] ?? '').trim();
                return (
                  <div key={campo.id}>
                    <dt className="text-[13px] font-medium text-white/45">
                      {conMarca(campo.l, brief.marca)}
                    </dt>
                    <dd
                      className={`mt-0.5 whitespace-pre-wrap text-sm leading-relaxed ${
                        valor ? 'text-white/85' : 'italic text-white/30'
                      }`}
                    >
                      {valor || 'Sin responder'}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        );
      })}

      <form
        action={guardarNotasBrief}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <input type="hidden" name="id" value={brief.id} />
        <label htmlFor="notas" className="text-sm font-medium text-white/60">
          Notas internas
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={5}
          maxLength={5000}
          defaultValue={brief.notas ?? ''}
          placeholder="Qué falta pedir, próximos pasos, acuerdos de la llamada…"
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
        />
        <button
          type="submit"
          className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
        >
          Guardar notas
        </button>
      </form>
    </div>
  );
}
