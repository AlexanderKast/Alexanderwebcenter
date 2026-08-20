import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { clientePanel, usuarioPanel } from '@/lib/brief/panel-auth';
import { conMarca, resolverCliente, seccionesPara } from '@/lib/brief/schema';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

interface Cabecera {
  id: string;
  cliente: string;
  marca: string;
  sector: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_tel: string;
  empresa: string;
  completado_pct: number;
  respondidas: number;
  total_campos: number;
  estado: string;
  created_at: string;
}

const UUID = /^[0-9a-f-]{36}$/i;
const IMAGEN = /\.(png|jpe?g|webp|gif|svg)(\?|$)/i;

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
      });
}

export default async function PaginaDetalle({ params }: Props) {
  if (!(await usuarioPanel())) redirect('/panel/login');

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await clientePanel();
  const { data: cabecera } = await supabase
    .from('brief_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle<Cabecera>();

  if (!cabecera) notFound();

  const { data: filas } = await supabase
    .from('brief_answers')
    .select('campo_id, valor')
    .eq('submission_id', id);

  const respuestas = new Map<string, string>();
  for (const fila of (filas ?? []) as { campo_id: string; valor: string }[]) {
    if (fila.valor.trim() !== '') respuestas.set(fila.campo_id, fila.valor);
  }

  const cliente = resolverCliente(cabecera.cliente);
  const secciones = seccionesPara(cabecera.sector || cliente.sector);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/panel" className="text-sm text-white/50 transition-colors hover:text-white">
        ← Volver al listado
      </Link>

      {/* Ficha de contacto: lo primero que se necesita para responderle */}
      <header className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
              {cabecera.marca}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">
              {cabecera.contacto_nombre || 'Sin nombre'}
            </h1>
            <p className="mt-2 text-sm text-white/60">{cabecera.empresa || 'Sin empresa'}</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-semibold text-yellow-400">{cabecera.completado_pct}%</p>
            <p className="text-xs text-white/40">
              {cabecera.respondidas} de {cabecera.total_campos} respuestas
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {cabecera.contacto_tel && (
            <a
              href={`https://wa.me/${cabecera.contacto_tel.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl border border-white/15 px-4 py-2 text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              WhatsApp {cabecera.contacto_tel}
            </a>
          )}
          {cabecera.contacto_email && (
            <a
              href={`mailto:${cabecera.contacto_email}`}
              className="rounded-xl border border-white/15 px-4 py-2 text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              {cabecera.contacto_email}
            </a>
          )}
        </div>

        <p className="mt-4 text-xs text-white/35">Enviado el {fecha(cabecera.created_at)}</p>
      </header>

      {/* El formulario tal cual lo vio la persona: todas las preguntas, en
          orden, con lo que respondio o el hueco que dejo. */}
      <div className="mt-6 space-y-5">
        {secciones.map((seccion) => {
          const campos = seccion.f;
          const llenos = campos.filter((campo) => respuestas.has(campo.id)).length;

          return (
            <section
              key={seccion.n}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                  {seccion.n}. {conMarca(seccion.t, cabecera.marca)}
                </h2>
                <span className="shrink-0 text-xs text-white/35">
                  {llenos}/{campos.length}
                </span>
              </div>

              <dl className="mt-4 space-y-4">
                {campos.map((campo) => {
                  const valor = respuestas.get(campo.id) ?? '';
                  const esUrl = /^https?:\/\//i.test(valor);
                  const esImagen = esUrl && IMAGEN.test(valor);

                  return (
                    <div
                      key={campo.id}
                      className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                    >
                      <dt className="text-sm text-white/45">
                        {conMarca(campo.l, cabecera.marca)}
                      </dt>
                      <dd className="mt-1.5">
                        {valor === '' ? (
                          <span className="text-sm italic text-white/25">Sin responder</span>
                        ) : esImagen ? (
                          <a href={valor} target="_blank" rel="noreferrer noopener">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={valor}
                              alt={campo.l}
                              className="max-h-56 rounded-xl border border-white/10 bg-black/40 object-contain p-2"
                            />
                          </a>
                        ) : esUrl ? (
                          <a
                            href={valor}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="break-all text-yellow-400 underline underline-offset-4"
                          >
                            {valor}
                          </a>
                        ) : (
                          <span className="whitespace-pre-wrap text-[15px] leading-relaxed">
                            {valor}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          );
        })}
      </div>
    </main>
  );
}
