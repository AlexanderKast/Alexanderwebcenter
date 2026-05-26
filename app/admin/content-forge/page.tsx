import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { Sparkles, FileText, Calendar, Image, Layers, ArrowUpRight } from 'lucide-react';

const herramientas = [
  {
    icon: Sparkles,
    titulo: 'Generador de Carruseles',
    desc: 'Crea carruseles para Instagram con IA. Texto + diseño.',
    comando: 'npm run gen -- --format=ig-carousel',
    color: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
  },
  {
    icon: FileText,
    titulo: 'Generador de Guiones',
    desc: 'Reels, TikToks y Shorts con tu voz y pilares.',
    comando: 'npm run gen -- --format=reel',
    color: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
  },
  {
    icon: Calendar,
    titulo: 'Calendario de Contenido',
    desc: 'Parrilla semanal/mensual balanceada por pilares.',
    comando: 'npm run calendar',
    color: 'from-green-500/10 to-green-600/5',
    border: 'border-green-500/20',
  },
  {
    icon: Image,
    titulo: 'Generador de Imágenes',
    desc: 'Slides y portadas con WaveSpeed AI o Gemini.',
    comando: 'npm run gen -- --format=ig-carousel --slides=10',
    color: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20',
  },
  {
    icon: Layers,
    titulo: 'Clonador de Virales',
    desc: 'Analiza posts virales y recrea el formato con tu marca.',
    comando: 'npm run clone -- --url=<ig|tiktok|linkedin>',
    color: 'from-pink-500/10 to-pink-600/5',
    border: 'border-pink-500/20',
  },
];

export default async function ContentForgePage() {
  await requireAuth();

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Content Forge</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Generación de contenido con IA
        </h1>
        <p className="mt-2 text-sm text-white/55 max-w-xl">
          Motor de producción de contenido. Conecta tu brand.config.json con WaveSpeed, Gemini y Claude
          para generar carruseles, reels, parrillas y análisis de referentes.
        </p>
      </div>

      {/* Brand Config Status */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
        <p className="eyebrow mb-3">Configuración activa</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Marca', value: 'Alexander Cast' },
            { label: 'Handle', value: '@alexemprendee' },
            { label: 'Plataforma', value: 'ig-carousel' },
            { label: 'Pilares', value: '5 activos' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-white/40 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-white font-medium mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Herramientas */}
      <div>
        <p className="eyebrow mb-4">Herramientas disponibles</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {herramientas.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.titulo}
                className={`rounded-2xl border ${h.border} bg-gradient-to-br ${h.color} p-5 hover:border-[color:var(--gold-mid)]/40 transition-colors group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/70">
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[color:var(--gold-mid)] transition-colors" />
                </div>
                <p className="font-semibold text-white text-sm mb-1">{h.titulo}</p>
                <p className="text-white/50 text-xs leading-relaxed mb-3">{h.desc}</p>
                <code className="text-[10px] font-mono text-[color:var(--gold-mid)]/70 bg-black/30 px-2 py-1 rounded block truncate">
                  {h.comando}
                </code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instrucciones rápidas */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <p className="eyebrow mb-4">Cómo usar</p>
        <ol className="space-y-3 text-sm text-white/70">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--gold-mid)]/20 text-[color:var(--gold-mid)] text-xs font-bold flex items-center justify-center">1</span>
            <span>Abre una terminal en <code className="text-[color:var(--gold-mid)]">scripts/content-forge/</code></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--gold-mid)]/20 text-[color:var(--gold-mid)] text-xs font-bold flex items-center justify-center">2</span>
            <span>Copia <code className="text-[color:var(--gold-mid)]">.env.example</code> a <code className="text-[color:var(--gold-mid)]">.env.local</code> y configura las API keys</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--gold-mid)]/20 text-[color:var(--gold-mid)] text-xs font-bold flex items-center justify-center">3</span>
            <span>Ejecuta <code className="text-[color:var(--gold-mid)]">npm install</code> y luego el comando de la herramienta que necesites</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--gold-mid)]/20 text-[color:var(--gold-mid)] text-xs font-bold flex items-center justify-center">4</span>
            <span>Los outputs van a <code className="text-[color:var(--gold-mid)]">scripts/content-forge/output/social/</code></span>
          </li>
        </ol>

        <div className="mt-5 pt-5 border-t border-[color:var(--line)]">
          <Link
            href="https://github.com/AlexanderKast"
            target="_blank"
            className="text-sm text-[color:var(--gold-mid)] hover:text-[color:var(--gold-light)] transition-colors flex items-center gap-1"
          >
            Ver documentación completa <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
