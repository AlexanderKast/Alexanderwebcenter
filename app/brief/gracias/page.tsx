import Link from 'next/link';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulario enviado — Alexander Cast',
  robots: { index: false, follow: false },
};

export default function BriefGraciasPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-6 text-white">
      <div className="max-w-lg text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Formulario enviado</h1>
        <p className="mb-8 leading-relaxed text-gray-400">
          Ya tenemos lo que necesitamos para preparar la propuesta. Revisamos tus respuestas y te
          escribimos para agendar la llamada de diagnóstico.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
