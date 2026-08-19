'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { AISuggestionChips } from './AISuggestionChips';

interface VoiceSectionProps {
  estiloComuncacional: string;
  expresionesNaturales: string[];
  prohibiciones: string[];
  nivelFormalidad: number;
  usoHumor: string;
  regionalismos: string;
  temasSensibles: string;
  onUpdate: (field: string, value: unknown) => void;
}

type InputMode = 'single' | 'bulk';

function ProgressCounter({ current, min, label }: { current: number; min: number; label: string }) {
  const pct = Math.min((current / min) * 100, 100);
  const isDone = current >= min;

  return (
    <div className="space-y-1.5 mb-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${isDone ? 'text-green-400' : 'text-yellow-400'}`}>
          {current}/{min} {label}
        </span>
        {isDone ? (
          <span className="text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">
            Completo
          </span>
        ) : (
          <span className="text-xs text-gray-500">Faltan {min - current}</span>
        )}
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-green-400' : 'bg-yellow-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BulkInputPanel({ placeholder, onAdd }: { placeholder: string; onAdd: (items: string[]) => void }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const lines = text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (lines.length > 0) {
      onAdd(lines);
      setText('');
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="min-h-[90px] text-sm"
      />
      <p className="text-xs text-gray-600">Separa cada expresión con Enter o coma.</p>
      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        disabled={!text.trim()}
        className="w-full text-sm border-gray-700 text-gray-300 hover:bg-gray-800"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Agregar todas
      </Button>
    </div>
  );
}

function ItemList({
  items,
  onRemove,
  variant,
}: {
  items: string[];
  onRemove: (i: number) => void;
  variant: 'green' | 'red';
}) {
  const numColor = variant === 'green' ? 'text-green-400' : 'text-red-400';
  const itemBg = variant === 'green'
    ? 'bg-green-400/5 border-green-400/20'
    : 'bg-red-400/5 border-red-400/20';

  return (
    <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item + i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex items-start gap-2.5 p-2.5 border rounded-lg group ${itemBg}`}
          >
            <span className={`text-xs font-mono mt-0.5 flex-shrink-0 ${numColor}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="flex-1 text-sm text-gray-200 leading-relaxed">&ldquo;{item}&rdquo;</p>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 flex-shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function VoiceSection({
  estiloComuncacional,
  expresionesNaturales,
  prohibiciones,
  nivelFormalidad,
  usoHumor,
  regionalismos,
  temasSensibles,
  onUpdate,
}: VoiceSectionProps) {
  const [newExpresion, setNewExpresion] = useState('');
  const [newProhibicion, setNewProhibicion] = useState('');
  const [expresionMode, setExpresionMode] = useState<InputMode>('single');
  const [prohibicionMode, setProhibicionMode] = useState<InputMode>('single');
  const [expresionSugs, setExpresionSugs] = useState<string[]>([]);
  const [expresionSugsLoading, setExpresionSugsLoading] = useState(false);

  const addExpresion = () => {
    const v = newExpresion.trim();
    if (v) {
      onUpdate('expresionesNaturales', [...expresionesNaturales, v]);
      setNewExpresion('');
    }
  };

  const addProhibicion = () => {
    const v = newProhibicion.trim();
    if (v) {
      onUpdate('prohibiciones', [...prohibiciones, v]);
      setNewProhibicion('');
    }
  };

  const addBulkExpresiones = (items: string[]) => {
    onUpdate('expresionesNaturales', [...expresionesNaturales, ...items.filter((i) => !expresionesNaturales.includes(i))]);
  };

  const handlePredictExpresiones = useCallback(async () => {
    if (expresionSugs.length > 0) { setExpresionSugs([]); return; }
    setExpresionSugsLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo: 'expresionesNaturales',
          contexto: { estiloComuncacional, expresionesExistentes: expresionesNaturales.join(', ') },
        }),
      });
      const data = await res.json();
      setExpresionSugs(Array.isArray(data.sugerencias) ? data.sugerencias : []);
    } catch {
      setExpresionSugs([]);
    }
    setExpresionSugsLoading(false);
  }, [expresionSugs.length, estiloComuncacional, expresionesNaturales]);

  const addBulkProhibiciones = (items: string[]) => {
    onUpdate('prohibiciones', [...prohibiciones, ...items.filter((i) => !prohibiciones.includes(i))]);
  };

  return (
    <div className="space-y-7">
      <p className="text-sm text-gray-400">
        El ADN comunicacional de tu marca. Esta es la sección más importante — tómatela con calma.
      </p>

      {/* Estilo comunicacional */}
      <div className="field-group">
        <Label htmlFor="estiloComuncacional" className="label-text">
          Estilo comunicacional *
        </Label>
        <p className="helper-text">
          Describe cómo habla tu marca: tono, actitud, referencias, metáforas que usas.
        </p>
        <Textarea
          id="estiloComuncacional"
          className="mt-2 min-h-[90px]"
          value={estiloComuncacional}
          onChange={(e) => onUpdate('estiloComuncacional', e.target.value)}
          placeholder="Cercano y directo, como un amigo experto que te habla sin rodeos. Usa metáforas del mundo real. Jamás condescendiente..."
        />
      </div>

      {/* Formalidad — tarjetas visuales */}
      <div className="p-5 rounded-xl bg-gray-950/50 border border-gray-800 space-y-3">
        <Label className="label-text">¿Cómo habla tu marca? *</Label>
        <p className="helper-text">Elige el tono que más se parece a cómo te comunicas con tus clientes.</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
          {[
            { value: 2,  emoji: 'ðŸ˜‚', label: 'Muy casual',    description: 'Como hablar con un amigo, sin filtros' },
            { value: 4,  emoji: 'ðŸ˜Š', label: 'Relajado',      description: 'Cercano y directo, pero ordenado' },
            { value: 6,  emoji: 'ðŸ¤', label: 'Equilibrado',   description: 'Ni muy informal ni muy serio' },
            { value: 8,  emoji: 'ðŸ‘”', label: 'Profesional',   description: 'Serio, con autoridad y criterio' },
            { value: 10, emoji: 'ðŸ›ï¸', label: 'Muy formal',    description: 'Corporativo e institucional' },
          ].map((card) => {
            const isSelected = nivelFormalidad <= card.value && (card.value === 2 || nivelFormalidad > card.value - 2);
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => onUpdate('nivelFormalidad', card.value)}
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
                <div className={`font-semibold text-xs mb-1 leading-tight ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {card.label}
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">{card.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Humor */}
      <div className="field-group">
        <Label className="label-text">¿Usas humor en tu contenido? *</Label>
        <p className="helper-text">¿Con qué frecuencia aparecen chistes, ironia o momentos graciosos?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {[
            { value: 'Alto',      emoji: 'ðŸ˜„', label: 'Bastante',    description: 'El humor es parte de tu estilo' },
            { value: 'Moderado',  emoji: 'ðŸ™‚', label: 'A veces',     description: 'Lo usas cuando viene al caso' },
            { value: 'Bajo',      emoji: 'ðŸ˜', label: 'Poco',        description: 'Raramente, casi siempre serio' },
            { value: 'Sin humor', emoji: 'ðŸŽ¯', label: 'Sin humor',   description: 'Tono directo y profesional' },
          ].map((opt) => {
            const isSelected = usoHumor === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate('usoHumor', opt.value)}
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
                <div className="text-xl mb-1">{opt.emoji}</div>
                <div className={`font-semibold text-xs mb-0.5 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {opt.label}
                </div>
                <div className="text-[10px] text-gray-500 leading-snug">{opt.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expresiones naturales */}
      <div className="p-5 rounded-xl bg-gray-950/50 border border-gray-800 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Label className="label-text">Frases que tu marca sí diría *</Label>
            <p className="helper-text">
              Palabras o frases que usas naturalmente cuando hablas con tus clientes. Cuantas más pongas, más auténtica y precisa quedará la voz de tu marca — la IA las usa para aprender a escribir <em>exactamente como tú</em>.
            </p>
          </div>
          {expresionesNaturales.length >= 1 && estiloComuncacional.length > 20 && (
            <button
              type="button"
              onClick={handlePredictExpresiones}
              className="flex-shrink-0 text-[11px] text-yellow-400/70 hover:text-yellow-400 transition-colors flex items-center gap-1 mt-0.5"
            >
              <span>âœ¦</span>
              {expresionSugsLoading ? 'Pensando...' : expresionSugs.length > 0 ? 'Cerrar' : 'Sugerir más'}
            </button>
          )}
        </div>

        {(expresionSugs.length > 0 || expresionSugsLoading) && (
          <AISuggestionChips
            suggestions={expresionSugs}
            loading={expresionSugsLoading}
            onSelect={(s) => {
              if (!expresionesNaturales.includes(s)) {
                onUpdate('expresionesNaturales', [...expresionesNaturales, s]);
              }
              setExpresionSugs((prev) => prev.filter((x) => x !== s));
            }}
          />
        )}

        <ProgressCounter current={expresionesNaturales.length} min={15} label="expresiones mínimo" />

        {/* Toggle modo */}
        <div className="flex rounded-lg border border-gray-800 overflow-hidden bg-gray-900 text-sm w-fit">
          <button
            type="button"
            onClick={() => setExpresionMode('single')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              expresionMode === 'single'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Una por una
          </button>
          <button
            type="button"
            onClick={() => setExpresionMode('bulk')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              expresionMode === 'bulk'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Pegar varias
          </button>
        </div>

        {expresionMode === 'single' ? (
          <div className="flex gap-2">
            <Input
              value={newExpresion}
              onChange={(e) => setNewExpresion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpresion())}
              placeholder='"Dale pues" / "Parce, escúchame" / "Aquí te lo explico"'
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addExpresion}
              aria-label="Agregar expresión"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <BulkInputPanel
            placeholder={'Pega aquí tus expresiones:\nDale pues\nParce, escúchame\nVamos que se puede'}
            onAdd={addBulkExpresiones}
          />
        )}

        {expresionesNaturales.length > 0 && (
          <ItemList
            items={expresionesNaturales}
            onRemove={(i) => onUpdate('expresionesNaturales', expresionesNaturales.filter((_, j) => j !== i))}
            variant="green"
          />
        )}
      </div>

      {/* Prohibiciones */}
      <div className="p-5 rounded-xl bg-gray-950/50 border border-gray-800 space-y-4">
        <div>
          <Label className="label-text">Cosas que tu marca NUNCA diría *</Label>
          <p className="helper-text">
            Palabras, frases o actitudes que van en contra de tu marca. Cada prohibición que agregues le enseña a la IA qué evitar — esto es lo que separa una voz genérica de una voz auténticamente tuya.
          </p>
        </div>

        <ProgressCounter current={prohibiciones.length} min={10} label="prohibiciones mínimo" />

        {/* Toggle modo */}
        <div className="flex rounded-lg border border-gray-800 overflow-hidden bg-gray-900 text-sm w-fit">
          <button
            type="button"
            onClick={() => setProhibicionMode('single')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              prohibicionMode === 'single'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Una por una
          </button>
          <button
            type="button"
            onClick={() => setProhibicionMode('bulk')}
            className={`px-4 py-1.5 font-medium transition-colors ${
              prohibicionMode === 'bulk'
                ? 'bg-yellow-400 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Pegar varias
          </button>
        </div>

        {prohibicionMode === 'single' ? (
          <div className="flex gap-2">
            <Input
              value={newProhibicion}
              onChange={(e) => setNewProhibicion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProhibicion())}
              placeholder='"crack" / "gurú" / jerga vulgar / resultados garantizados'
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addProhibicion}
              aria-label="Agregar prohibición"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <BulkInputPanel
            placeholder={'Pega aquí tus prohibiciones:\nGurú\nCrack\nHacerse rico rápido'}
            onAdd={addBulkProhibiciones}
          />
        )}

        {prohibiciones.length > 0 && (
          <ItemList
            items={prohibiciones}
            onRemove={(i) => onUpdate('prohibiciones', prohibiciones.filter((_, j) => j !== i))}
            variant="red"
          />
        )}
      </div>

      {/* Regionalismos */}
      <div className="field-group">
        <Label htmlFor="regionalismos" className="label-text">
          Regionalismos o slang{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">Términos locales que usa tu audiencia para calibrar el tono geográfico.</p>
        <Textarea
          id="regionalismos"
          className="mt-2"
          value={regionalismos}
          onChange={(e) => onUpdate('regionalismos', e.target.value)}
          placeholder='Usa términos colombianos como "bacano", "parce". Evita regionalismos de España.'
        />
      </div>

      {/* Temas sensibles */}
      <div className="field-group">
        <Label htmlFor="temasSensibles" className="label-text">
          Temas sensibles a manejar con cuidado{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">Temas que la marca puede tocar pero con mucha delicadeza.</p>
        <Textarea
          id="temasSensibles"
          className="mt-2"
          value={temasSensibles}
          onChange={(e) => onUpdate('temasSensibles', e.target.value)}
          placeholder="Política, religión, comparaciones directas con competidores nombrados..."
        />
      </div>
    </div>
  );
}

