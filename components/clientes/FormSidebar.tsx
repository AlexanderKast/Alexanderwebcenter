'use client';

import Image from 'next/image';

interface FormSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

const STEPS = [
  { label: 'Tipo de Marca', description: 'Personal, producto o servicio' },
  { label: 'Identidad', description: 'Nombre, nicho, expertise' },
  { label: 'Audiencia', description: 'A quién le hablas' },
  { label: 'Propuesta de Valor', description: 'Qué ofreces y precio' },
  { label: 'Voz y Tono', description: 'Cómo habla tu marca' },
  { label: 'Pilares', description: 'Temas de contenido' },
  { label: 'Filosofía', description: 'Propósito y valores' },
  { label: 'Objetivos', description: 'KPIs y plataformas' },
  { label: 'Contexto', description: 'Extras y restricciones' },
];

const TIMES_PER_STEP = [2, 4, 4, 3, 5, 3, 4, 3, 2];

export function FormSidebar({ currentStep, completedSteps }: FormSidebarProps) {
  const completedCount = completedSteps.length;
  const percentage = Math.round((completedCount / STEPS.length) * 100);
  const remainingMinutes = TIMES_PER_STEP.slice(currentStep).reduce((a, b) => a + b, 0);

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col min-h-screen" style={{ background: '#0D0D0F', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo Alexander Cast */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/AC_Mesa de trabajo 1.png"
            alt="Alexander Cast"
            width={500}
            height={500}
            style={{ width: '160px', height: 'auto' }}
            priority
          />
        </div>

        {/* Separador con label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(212,160,23,0.2)' }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: '#D4A017' }}>Brand Architect</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(212,160,23,0.2)' }} />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">Progreso</span>
            <span className="text-xs font-bold" style={{ color: '#D4A017' }}>{percentage}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #F2CB51, #D4A017)',
              }}
            />
          </div>
          <p className="text-xs text-stone-600">
            {completedCount} de {STEPS.length} secciones completadas
          </p>
        </div>
      </div>

      {/* Steps list */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'border'
                  : isCompleted
                  ? 'hover:bg-white/3'
                  : 'opacity-50'
              }`}
              style={isCurrent ? {
                background: 'rgba(212,160,23,0.08)',
                borderColor: 'rgba(212,160,23,0.35)',
              } : undefined}
            >
              {/* Estado */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#D4A017' }}>
                    <div className="w-2 h-2 rounded-full bg-black/60" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-stone-700 flex items-center justify-center">
                    <span className="text-[9px] text-stone-600 font-bold">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0">
                <p className={`text-sm font-medium leading-tight truncate ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-stone-700 mt-0.5 truncate">{step.description}</p>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs text-stone-600">Progreso guardado automáticamente</p>
        </div>
        {remainingMinutes > 0 && (
          <p className="text-xs text-stone-700">~{remainingMinutes} min estimados restantes</p>
        )}
      </div>
    </aside>
  );
}

