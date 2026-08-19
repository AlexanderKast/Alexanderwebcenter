'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const TIEMPO_CARDS = [
  { value: 3,  emoji: '⚡', label: '1–3 h',      description: 'Muy poco, lo hago entre otras cosas' },
  { value: 7,  emoji: 'ðŸ•', label: '4–7 h',      description: 'Algunos ratos libres a la semana' },
  { value: 15, emoji: 'ðŸ’ª', label: '8–15 h',     description: 'Le dedico tiempo real cada semana' },
  { value: 25, emoji: 'ðŸš€', label: '16–25 h',    description: 'Es una prioridad en mi agenda' },
  { value: 40, emoji: 'ðŸ”¥', label: '26–40 h',    description: 'Prácticamente tiempo completo' },
];

const OBJETIVO_OPTIONS = [
  { id: 'awareness', label: 'Visibilidad',   description: 'Que más gente conozca tu marca y te descubra', emoji: 'ðŸ“¢' },
  { id: 'leads',     label: 'Contactos',     description: 'Que personas interesadas te escriban o dejen sus datos', emoji: 'ðŸŽ¯' },
  { id: 'ventas',    label: 'Ventas',        description: 'Convertir seguidores en compradores directos', emoji: 'ðŸ’°' },
  { id: 'comunidad', label: 'Comunidad',     description: 'Construir una audiencia fiel que te apoye y comparta', emoji: 'â¤ï¸' },
] as const;

const PLATAFORMAS = [
  'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X / Twitter',
  'Facebook', 'Blog / SEO', 'Pinterest', 'Threads', 'WhatsApp',
];

interface ObjectivesSectionProps {
  objetivoPrincipal: 'awareness' | 'leads' | 'ventas' | 'comunidad';
  kpiCritico: string;
  frecuenciaContenido: string;
  plataformas: string[];
  tiempoPorSemana: number;
  presupuesto: string;
  equipo: string;
  timeline: string;
  onUpdate: (field: string, value: unknown) => void;
}

export function ObjectivesSection({
  objetivoPrincipal,
  kpiCritico,
  frecuenciaContenido,
  plataformas,
  tiempoPorSemana,
  presupuesto,
  equipo,
  timeline,
  onUpdate,
}: ObjectivesSectionProps) {
  const togglePlataforma = (p: string) => {
    onUpdate(
      'plataformas',
      plataformas.includes(p) ? plataformas.filter((x) => x !== p) : [...plataformas, p]
    );
  };

  return (
    <div className="space-y-6">
      {/* Objetivo principal */}
      <div className="field-group">
        <Label className="label-text">Objetivo principal *</Label>
        <p className="helper-text">El norte que guía toda la estrategia de contenido.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {OBJETIVO_OPTIONS.map((opt) => {
            const isSelected = objetivoPrincipal === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdate('objetivoPrincipal', opt.id)}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  hover:-translate-y-0.5 focus:outline-none
                  ${isSelected
                    ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_16px_rgba(251,191,36,0.1)]'
                    : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="text-2xl mb-2">{opt.emoji}</div>
                <div className={`font-semibold text-sm mb-1 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500">{opt.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI crítico */}
      <div className="field-group">
        <Label htmlFor="kpiCritico" className="label-text">¿Cómo sabrás que está funcionando? *</Label>
        <p className="helper-text">
          El número o resultado concreto que te dirá &quot;esto sí está dando resultados&quot;. Por ejemplo: 20 personas nuevas que preguntan por mes, 1.000 seguidores nuevos, 5 ventas semanales...
        </p>
        <Input
          id="kpiCritico"
          className="mt-2"
          value={kpiCritico}
          onChange={(e) => onUpdate('kpiCritico', e.target.value)}
          placeholder="Ej: 20 personas preguntando por mes / 1.000 seguidores nuevos / 5 ventas semanales"
        />
      </div>

      {/* Frecuencia de contenido */}
      <div className="field-group">
        <Label htmlFor="frecuenciaContenido" className="label-text">Frecuencia de contenido *</Label>
        <p className="helper-text">¿Con qué regularidad publicarás y en qué formatos?</p>
        <Input
          id="frecuenciaContenido"
          className="mt-2"
          value={frecuenciaContenido}
          onChange={(e) => onUpdate('frecuenciaContenido', e.target.value)}
          placeholder="Ej: 5 Reels/semana en Instagram + 1 video YouTube semanal"
        />
      </div>

      {/* Plataformas */}
      <div className="field-group">
        <Label className="label-text">Plataformas *</Label>
        <p className="helper-text">Selecciona todas las que apliquen.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {PLATAFORMAS.map((p) => {
            const isSelected = plataformas.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlataforma(p)}
                className={`
                  px-3 py-2 rounded-lg border text-sm font-medium transition-all
                  ${isSelected
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                  }
                `}
              >
                {p}
              </button>
            );
          })}
        </div>
        {plataformas.length === 0 && (
          <p className="error-text">Selecciona al menos una plataforma</p>
        )}
      </div>

      {/* Tiempo por semana */}
      <div className="p-5 rounded-xl bg-gray-950/50 border border-gray-800 space-y-3">
        <Label className="label-text">¿Cuánto tiempo puedes dedicarle por semana? *</Label>
        <p className="helper-text">Esto define qué tan ambicioso puede ser el plan de contenido.</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
          {TIEMPO_CARDS.map((card, idx) => {
            const prevValue = idx === 0 ? 0 : TIEMPO_CARDS[idx - 1].value;
            const isSelected = tiempoPorSemana > prevValue && tiempoPorSemana <= card.value;
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => onUpdate('tiempoPorSemana', card.value)}
                className={`
                  relative p-3 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 focus:outline-none
                  ${isSelected
                    ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg className="w-2 h-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="text-xl mb-1">{card.emoji}</div>
                <div className={`font-semibold text-xs mb-0.5 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {card.label}
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">{card.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: presupuesto + timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="field-group">
          <Label htmlFor="presupuesto" className="label-text">
            ¿Cuánto puedes invertir al mes?{' '}
            <span className="font-normal text-gray-600">(opcional)</span>
          </Label>
          <p className="helper-text">Para publicidad pagada (pauta). Si no tienes presupuesto de pauta, escribe $0.</p>
          <Input
            id="presupuesto"
            className="mt-2"
            value={presupuesto}
            onChange={(e) => onUpdate('presupuesto', e.target.value)}
            placeholder="Ej: $300 USD/mes para pauta en Instagram"
          />
        </div>

        <div className="field-group">
          <Label htmlFor="timeline" className="label-text">¿En cuánto tiempo quieres ver resultados? *</Label>
          <p className="helper-text">Sé realista — construir marca sólida toma tiempo.</p>
          <Input
            id="timeline"
            className="mt-2"
            value={timeline}
            onChange={(e) => onUpdate('timeline', e.target.value)}
            placeholder="Ej: Primeros resultados en 90 días, escala en 6 meses"
          />
        </div>
      </div>

      {/* Equipo */}
      <div className="field-group">
        <Label htmlFor="equipo" className="label-text">
          ¿Con quién cuentas para crear contenido?{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">¿Trabajas solo o tienes ayuda? Eso define qué tan ambicioso puede ser el plan.</p>
        <Textarea
          id="equipo"
          className="mt-2"
          value={equipo}
          onChange={(e) => onUpdate('equipo', e.target.value)}
          placeholder="Solo yo por ahora / Tengo 1 asistente part-time / Equipo de 3: yo, editor de video, community manager"
        />
      </div>
    </div>
  );
}

