import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Barra fija para /brief: el formulario vive fuera del layout publico,
 * asi que sin esto no habia forma de volver al sitio.
 */
export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030303]/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver al sitio
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
