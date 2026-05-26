import Link from 'next/link';
import { ArrowRight, Brain, Target, Mic, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Architect — Alexander Cast',
  description:
    'Sistema de onboarding de marca personal. Configura tu ADN de marca, pilares de contenido y estrategia en 30 minutos.',
  robots: { index: false },
};

const pasos = [
  {
    icon: Target,
    titulo: 'Define tu identidad',
    desc: 'Quién eres, a quién sirves y qué te hace diferente.',
  },
  {
    icon: Mic,
    titulo: 'Calibra tu voz',
    desc: 'Expresiones naturales, prohibiciones y nivel de formalidad.',
  },
  {
    icon: Brain,
    titulo: 'Construye tus pilares',
    desc: 'Los 3–5 temas que guiarán todo tu contenido.',
  },
  {
    icon: BarChart3,
    titulo: 'Establece objetivos',
    desc: 'KPIs, plataformas, frecuencia y recursos disponibles.',
  },
];

export default function ClientesPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-3xl mx-auto">
        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-yellow-400/30 text-yellow-400 bg-yellow-400/5">
          Brand Architect · Sistema privado
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Construye el ADN<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            de tu marca personal
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Un sistema de 9 pasos para estructurar tu identidad, voz, pilares y estrategia.
          Al final recibes un documento maestro listo para usar con IA, creadores y tu equipo.
        </p>
        <Link
          href="/clientes/onboarding"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-yellow-400 text-black hover:bg-yellow-300 transition-all hover:-translate-y-0.5 shadow-[0_4px_32px_rgba(212,175,55,0.35)]"
        >
          Comenzar ahora
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-4 text-xs text-gray-600">~30 minutos · Auto-guardado automático · Privado</p>
      </section>

      {/* Pasos */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-10">
          Lo que construirás
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pasos.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.titulo}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-yellow-400/20 transition-colors"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold text-white text-sm">{p.titulo}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-gray-600">
          © 2026 Alexander Cast ·{' '}
          <Link href="/" className="hover:text-yellow-400 transition-colors">
            Volver al inicio
          </Link>
        </p>
      </footer>
    </div>
  );
}
