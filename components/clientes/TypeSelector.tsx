// @ts-nocheck
'use client';

import { BrandType } from '@/types/brand';

interface TypeSelectorProps {
  value: BrandType;
  onChange: (type: BrandType) => void;
}

const OPTIONS: Array<{ id: BrandType; label: string; description: string; emoji: string }> = [
  {
    id: 'personal',
    label: 'Marca Personal',
    description: 'Coach, consultor, experto, influencer, profesional independiente',
    emoji: 'ðŸ‘¤',
  },
  {
    id: 'producto',
    label: 'Producto',
    description: 'Producto fÃ­sico o digital, ecommerce, SaaS, app',
    emoji: 'ðŸ“¦',
  },
  {
    id: 'servicio',
    label: 'Servicio / Empresa',
    description: 'Agencia, estudio, empresa de servicios, B2B',
    emoji: 'ðŸ¢',
  },
];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Â¿QuÃ© tipo de marca estructuraremos?</h2>
        <p className="mt-1.5 text-sm text-gray-400">
          Selecciona el tipo que mejor describe tu marca. Esto adaptarÃ¡ las preguntas del formulario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPTIONS.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`
                relative p-6 rounded-xl border-2 text-left transition-all duration-200
                hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                ${isSelected
                  ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                  : 'border-gray-800 bg-gray-950 hover:border-gray-600'
                }
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="text-4xl mb-4">{option.emoji}</div>
              <h3 className={`font-semibold text-base mb-2 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                {option.label}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>

              {isSelected && (
                <p className="mt-4 text-xs font-semibold text-yellow-400">
                  âœ“ Seleccionado
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

