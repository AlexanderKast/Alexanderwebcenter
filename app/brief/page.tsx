import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Clock, Save, ShieldCheck } from 'lucide-react';
import { listaClientes, seccionesPara } from '@/lib/brief/schema';

export const metadata: Metadata = {
  title: 'Brief de marca — Alexander Cast',
  description:
    'Cuestionario de descubrimiento: con estas respuestas definimos qué plataforma construir y cómo.',
  robots: { index: false, follow: false },
};

const pasos = [
  {
    icon: Clock,
    titulo: 'Responde de corrido',
    desc: 'Unos 20 minutos. Si no sabés algo, escribí “no sé”: eso también nos sirve.',
  },
  {
    icon: Save,
    titulo: 'Se guarda solo',
    desc: 'El borrador queda en tu dispositivo. Podés cerrar y retomar donde ibas.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Llega directo al equipo',
    desc: 'Al enviar entra a nuestro panel. Nadie más ve tus respuestas.',
  },
];

export default function BriefPage() {
  const clientes = listaClientes();

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-24 text-center">
        <span className="mb-4 inline-block rounded-full border border-yellow-400/30 bg-yellow-400/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-yellow-400">
          Brief de proyecto
        </span>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          Contanos de tu marca
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            para saber qué construir
          </span>
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-400">
          Con estas respuestas definimos la plataforma: qué se construye, cómo y en qué orden. Entre
          más concreto sea cada dato, menos rondas de corrección.
        </p>

        <div className="mb-12 grid gap-4 text-left sm:grid-cols-3">
          {pasos.map(({ icon: Icono, titulo, desc }) => (
            <div key={titulo} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <Icono className="mb-3 h-5 w-5 text-yellow-400" aria-hidden />
              <p className="text-sm font-semibold">{titulo}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-left">
          <p className="text-center text-xs uppercase tracking-widest text-white/35">
            Elegí tu marca
          </p>
          {clientes.map((cliente) => (
            <Link
              key={cliente.slug}
              href={`/brief/${cliente.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-yellow-400/40 hover:bg-white/[0.04]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
                style={{ backgroundColor: cliente.acento }}
              >
                {cliente.marca.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{cliente.marca}</span>
                <span className="block text-xs text-gray-500">
                  {cliente.categoria} · {seccionesPara(cliente.sector).length} secciones
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-white/40" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
