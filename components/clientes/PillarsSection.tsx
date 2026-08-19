'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

interface Pilar {
  nombre: string;
  porcentaje: number;
}

interface PillarsSectionProps {
  pilares: Pilar[];
  mensajeCentral: string;
  onUpdate: (field: string, value: unknown) => void;
}

const EXAMPLE_PILLARS: Pilar[] = [
  { nombre: 'Educación', porcentaje: 40 },
  { nombre: 'Inspiración', porcentaje: 25 },
  { nombre: 'Detrás de cámaras', porcentaje: 20 },
  { nombre: 'Ventas', porcentaje: 15 },
];

const PILLAR_COLORS = [
  'from-yellow-400 to-yellow-600',
  'from-amber-400 to-orange-500',
  'from-orange-400 to-red-500',
  'from-yellow-300 to-yellow-500',
  'from-gold-400 to-gold-600',
];

const PILLAR_BAR_COLORS = [
  'bg-yellow-400',
  'bg-amber-400',
  'bg-orange-400',
  'bg-yellow-300',
  'bg-yellow-500',
];

export function PillarsSection({ pilares, mensajeCentral, onUpdate }: PillarsSectionProps) {
  const [newNombre, setNewNombre] = useState('');

  const safePct = (v: unknown) =>
    typeof v === 'number' && !isNaN(v) ? v : 0;

  const total = pilares.reduce((s, p) => s + safePct(p.porcentaje), 0);
  const isComplete = total === 100;

  const addPilar = () => {
    const nombre = newNombre.trim();
    if (!nombre || pilares.length >= 5) return;
    const defaultPct = Math.max(5, Math.min(20, 100 - total));
    onUpdate('pilares', [...pilares, { nombre, porcentaje: defaultPct }]);
    setNewNombre('');
  };

  const removePilar = (idx: number) => {
    onUpdate('pilares', pilares.filter((_, i) => i !== idx));
  };

  const updatePorcentaje = (idx: number, value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return;
    onUpdate('pilares', pilares.map((p, i) => (i === idx ? { ...p, porcentaje: value } : p)));
  };

  return (
    <div className="space-y-6">
      {/* Mensaje central */}
      <div className="space-y-3">
        <div className="field-group">
          <Label htmlFor="mensajeCentral" className="label-text">
            Tu mensaje central *
          </Label>
          <p className="helper-text">
            La idea principal que tu marca repite una y otra vez. No es un slogan — es una verdad que defiendes con convicción y que guía todo tu contenido.
          </p>
        </div>

        {/* Ejemplos */}
        <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          <p className="text-xs font-semibold text-yellow-400 mb-2">Ejemplos de mensajes centrales:</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• &ldquo;Cualquier persona puede vivir de su marca personal si domina el contenido estratégico&rdquo;</li>
            <li>• &ldquo;El problema no es que no tengas tiempo — es que no tienes un sistema&rdquo;</li>
            <li>• &ldquo;El contenido que vende no es el más viral, es el más coherente&rdquo;</li>
          </ul>
        </div>

        <Textarea
          id="mensajeCentral"
          className="min-h-[80px]"
          value={mensajeCentral}
          onChange={(e) => onUpdate('mensajeCentral', e.target.value)}
          placeholder="La creencia central que quieres que tu audiencia adopte..."
        />
        {mensajeCentral.length > 0 && mensajeCentral.length < 20 && (
          <p className="error-text">Necesitas al menos 20 caracteres ({20 - mensajeCentral.length} más)</p>
        )}
      </div>

      {/* Ejemplo típico cuando no hay pilares */}
      {pilares.length === 0 && (
        <div className="p-4 bg-gray-950/50 border border-dashed border-gray-700 rounded-xl">
          <p className="text-sm font-medium text-gray-300 mb-2">Ejemplo típico para marcas de conocimiento:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {EXAMPLE_PILLARS.map((p) => (
              <span key={p.nombre} className="chip chip-gold text-xs">
                {p.nombre} ({p.porcentaje}%)
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onUpdate('pilares', EXAMPLE_PILLARS)}
            className="text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            Cargar estos ejemplos para ajustar â†’
          </button>
        </div>
      )}

      {/* Agregar pilar */}
      {pilares.length < 5 && (
        <div className="field-group">
          <Label className="label-text">
            Agregar pilar
            <span className="ml-2 text-xs font-normal text-gray-600">{pilares.length}/5 máximo</span>
          </Label>
          <p className="helper-text">Escribe el nombre del tema y presiona Enter. Luego ajusta el porcentaje.</p>
          <div className="flex gap-2 mt-2">
            <Input
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPilar())}
              placeholder="Ej: Educación / Motivación / Detrás de cámaras / Casos de éxito"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addPilar}
              aria-label="Agregar pilar"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lista de pilares */}
      <AnimatePresence>
        {pilares.map((pilar, i) => {
          const gradient = PILLAR_COLORS[i % PILLAR_COLORS.length];
          const barColor = PILLAR_BAR_COLORS[i % PILLAR_BAR_COLORS.length];
          return (
            <motion.div
              key={pilar.nombre + i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative p-5 bg-gray-950/70 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-black font-bold text-sm">{i + 1}</span>
                  </div>
                  <span className="font-semibold text-white">{pilar.nombre}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removePilar(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  aria-label={`Eliminar pilar ${pilar.nombre}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Porcentaje de contenido</span>
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      min={5}
                      max={60}
                      step={5}
                      value={safePct(pilar.porcentaje) || ''}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 5 && v <= 60) updatePorcentaje(i, v);
                      }}
                      className="w-14 bg-transparent text-right text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400/20 focus:border-yellow-400 outline-none transition-colors"
                    />
                    <span className="text-2xl font-bold text-yellow-400">%</span>
                  </div>
                </div>

                {/* Barra visual */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${safePct(pilar.porcentaje)}%` }}
                  />
                </div>

                <Slider
                  value={[safePct(pilar.porcentaje)]}
                  onValueChange={(vals) => {
                    const raw = Array.isArray(vals) ? vals[0] : (vals as unknown as number);
                    updatePorcentaje(i, raw);
                  }}
                  min={5}
                  max={60}
                  step={5}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Total acumulado */}
      {pilares.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-xl border-2 transition-all ${
            isComplete
              ? 'bg-green-400/5 border-green-400/40'
              : total > 100
              ? 'bg-red-400/5 border-red-400/40'
              : 'bg-yellow-400/5 border-yellow-400/30'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-sm font-medium text-gray-300">Total acumulado</span>
            </div>
            <span className={`text-2xl font-black ${
              isComplete ? 'text-green-400' : total > 100 ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {isNaN(total) ? 0 : total}%
            </span>
          </div>

          {/* Barra total */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete ? 'bg-green-400' : total > 100 ? 'bg-red-400' : 'bg-yellow-400'
              }`}
              style={{ width: `${Math.min(total, 100)}%` }}
            />
          </div>

          {!isComplete && (
            <p className={`text-xs mt-2 ${total > 100 ? 'text-red-400' : 'text-yellow-400'}`}>
              {total < 100
                ? `Falta ${100 - total}% por distribuir`
                : `Sobran ${total - 100}% — reduce algunos pilares`}
            </p>
          )}
          {isComplete && (
            <p className="text-xs text-green-400 mt-2 font-medium">Perfecto — suma exactamente 100%</p>
          )}
        </motion.div>
      )}

      {pilares.length < 3 && (
        <p className="text-sm text-yellow-400 font-medium">
          Necesitas mínimo 3 pilares — agrega {3 - pilares.length} más.
        </p>
      )}
    </div>
  );
}

