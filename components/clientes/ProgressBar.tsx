'use client';

const STEP_LABELS = [
  'Tipo',
  'Identidad',
  'Audiencia',
  'Valor',
  'Voz',
  'Pilares',
  'Filosofia',
  'Objetivos',
  'Contexto',
];

interface ProgressBarProps {
  current: number;
  total: number;
  completedSteps?: number[];
}

export function ProgressBar({ current, total, completedSteps = [] }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Barra delgada de progreso */}
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #F2CB51, #D4A017)' }}
        />
      </div>

      {/* Pasos numerados */}
      <div className="flex items-center justify-between gap-1">
        {STEP_LABELS.map((label, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isCurrent = idx === current;

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 flex-1 min-w-0"
              title={label}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={
                  isCurrent
                    ? { background: '#D4A017', color: '#0A0A0B', boxShadow: '0 0 0 2px rgba(212,160,23,0.3)' }
                    : isCompleted
                    ? { background: '#22c55e', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.08)', color: '#57534e' }
                }
              >
                {isCompleted && !isCurrent ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className="text-[9px] truncate w-full text-center hidden sm:block leading-none"
                style={{ color: isCurrent ? '#D4A017' : isCompleted ? '#22c55e' : '#57534e', fontWeight: isCurrent ? 600 : 400 }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Texto de estado */}
      <p className="text-xs text-stone-600 text-center">
        <span className="font-medium text-stone-400">
          Paso {current + 1} de {total + 1}:
        </span>{' '}
        {STEP_LABELS[current]}
      </p>
    </div>
  );
}

