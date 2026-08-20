import Link from 'next/link';
import { accionSalir } from './login/acciones';
import { usuarioPanel } from '@/lib/brief/panel-auth';

export const dynamic = 'force-dynamic';

/**
 * El layout no bloquea: cada pagina protegida llama a usuarioPanel().
 * Asi /panel/login sigue siendo accesible dentro del mismo chrome.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await usuarioPanel();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {usuario && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
            <Link href="/panel" className="text-sm font-semibold">
              Respuestas del formulario
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-white/40 sm:block">{usuario.email}</span>
              <Link href="/" className="text-xs text-white/50 transition-colors hover:text-white">
                Ir al sitio
              </Link>
              <form action={accionSalir}>
                <button
                  type="submit"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  Salir
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      {children}
    </div>
  );
}
