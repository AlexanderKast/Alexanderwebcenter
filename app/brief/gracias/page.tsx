import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Formulario enviado' },
  robots: { index: false, follow: false },
};

const QUE_SIGUE = [
  {
    n: '01',
    t: 'Leemos tus respuestas',
    d: 'Las revisamos completas y armamos el mapa de lo que hay que construir.',
  },
  {
    n: '02',
    t: 'Te escribimos',
    d: 'Si algo quedó flojo o falta material, te lo pedimos concreto por WhatsApp.',
  },
  {
    n: '03',
    t: 'Diagnóstico de 45 minutos',
    d: 'Cerramos alcance, plazos y presupuesto, y arranca el desarrollo.',
  },
];

export default function BriefGraciasPage() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 pt-[130px] text-white">
      <div className="text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Formulario enviado</h1>
        <p className="mx-auto max-w-xl leading-relaxed text-gray-400">
          Ya tenemos con qué trabajar. Tus respuestas entraron a nuestro panel y nadie más las ve.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {QUE_SIGUE.map((paso) => (
          <li
            key={paso.n}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left"
          >
            <span className="text-xs font-semibold tracking-widest text-yellow-400">{paso.n}</span>
            <p className="mt-2 text-sm font-semibold">{paso.t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{paso.d}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Ir al inicio
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
        >
          Ver servicios
        </Link>
        <a
          href="https://wa.me/573132947776?text=Hola%20Alexander%2C%20acabo%20de%20enviar%20el%20formulario"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Escribir por WhatsApp
        </a>
      </div>
    </main>
  );
}
