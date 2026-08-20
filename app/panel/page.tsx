import Link from 'next/link';
import { redirect } from 'next/navigation';
import { clientePanel, usuarioPanel } from '@/lib/brief/panel-auth';

export const dynamic = 'force-dynamic';

interface FilaBrief {
  id: string;
  marca: string;
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

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
      });
}

export default async function PaginaPanel() {
  if (!(await usuarioPanel())) redirect('/panel/login');

  // Lee con la sesion del admin: las politicas de la base solo dejan
  // ver las respuestas a ese correo.
  const supabase = await clientePanel();
  const { data, error } = await supabase
    .from('brief_submissions')
    .select(
      'id, marca, contacto_nombre, contacto_email, contacto_tel, empresa, completado_pct, respondidas, total_campos, estado, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-200">
          No pude leer las respuestas: {error.message}
        </p>
      </main>
    );
  }

  const filas = (data ?? []) as FilaBrief[];
  const sinLeer = filas.filter((f) => f.estado === 'nuevo').length;
  const promedio =
    filas.length === 0
      ? 0
      : Math.round(filas.reduce((s, f) => s + f.completado_pct, 0) / filas.length);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-3xl font-semibold">{filas.length}</p>
          <p className="text-xs text-white/40">formularios recibidos</p>
        </div>
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5">
          <p className="text-3xl font-semibold text-yellow-400">{sinLeer}</p>
          <p className="text-xs text-white/40">sin leer</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-3xl font-semibold">{promedio}%</p>
          <p className="text-xs text-white/40">completado promedio</p>
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-white/60">Todavía no llegó ningún formulario.</p>
          <Link
            href="/brief"
            className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Ver el formulario
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Completado</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Recibido</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr
                  key={f.id}
                  className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/panel/${f.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {f.contacto_nombre || 'Sin nombre'}
                    </Link>
                    <div className="text-xs text-white/40">
                      {f.contacto_email || f.contacto_tel || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {f.marca}
                    <div className="text-xs text-white/40">{f.empresa || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full bg-yellow-400"
                          style={{ width: `${f.completado_pct}%` }}
                        />
                      </span>
                      <span className="text-xs text-white/50">
                        {f.completado_pct}% · {f.respondidas}/{f.total_campos}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/60">{f.estado}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{fecha(f.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
