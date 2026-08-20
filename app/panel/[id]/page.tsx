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

export default async function PaginaDetalle({ params }: Props) {
  if (!(await usuarioPanel())) redirect('/panel/login');

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  // Lee con la sesion del admin: las politicas de la base solo dejan
  // ver las respuestas a ese correo.
  const supabase = await clientePanel();
  const { data: cabecera } = await supabase
    .from('brief_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle<Cabecera>();

  if (!cabecera) notFound();

  const { data: respuestas } = await supabase
    .from('brief_answers')
    .select('campo_id, valor')
    .eq('submission_id', id);

  const mapa = new Map<string, string>();
  for (const fila of (respuestas ?? []) as { campo_id: string; valor: string }[]) {
    mapa.set(fila.campo_id, fila.valor);
  }

  const cliente = resolverCliente(cabecera.cliente);
  const secciones = seccionesPara(cabecera.sector || cliente.sector);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/panel" className="text-sm text-white/50 transition-colors hover:text-white">
        ← Volver al listado
      </Link>

      <header className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
          {cabecera.marca}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{cabecera.contacto_nombre || 'Sin nombre'}</h1>
        <p className="mt-2 text-sm text-white/60">
          {cabecera.empresa || 'Sin empresa'} · {cabecera.contacto_email || 'sin correo'} ·{' '}
          {cabecera.contacto_tel || 'sin WhatsApp'}
        </p>
        <p className="mt-1 text-xs text-white/35">
          {cabecera.completado_pct}% completado · {cabecera.respondidas} de {cabecera.total_campos}{' '}
          respuestas
        </p>
      </header>

      <div className="mt-6 space-y-6">
        {secciones.map((seccion) => {
          const campos = seccion.f.filter((campo) => (mapa.get(campo.id) ?? '') !== '');
          if (campos.length === 0) return null;

          return (
            <section
              key={seccion.n}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                {seccion.n}. {conMarca(seccion.t, cabecera.marca)}
              </h2>

              <dl className="mt-4 space-y-4">
                {campos.map((campo) => {
                  const valor = mapa.get(campo.id) ?? '';
                  const esEnlace = campo.ty === 'archivo' && /^https?:\/\//i.test(valor);
                  return (
                    <div
                      key={campo.id}
                      className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                    >
                      <dt className="text-sm text-white/50">{conMarca(campo.l, cabecera.marca)}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-[15px]">
                        {esEnlace ? (
                          <a
                            href={valor}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-yellow-400 underline underline-offset-4"
                          >
                            Abrir archivo
                          </a>
                        ) : (
                          valor
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
