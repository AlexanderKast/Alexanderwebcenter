// @ts-nocheck
'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { AISuggestionChips } from './AISuggestionChips';

interface PhilosophySectionProps {
  creenciasFundamentales: string[];
  queRechaza: string[];
  limitesEticos: string[];
  propositoMarca: string;
  historiaOrigen: string;
  historiaBatallas: string;
  historiaLogros: string;
  onUpdate: (field: string, value: unknown) => void;
}

type ChipVariant = 'gold' | 'red' | 'gray';

function DynamicList({
  label,
  description,
  items,
  onAdd,
  onRemove,
  placeholder,
  min,
  max,
  variant = 'gold',
}: {
  label: string;
  description?: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
  min: number;
  max: number;
  variant?: ChipVariant;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const v = input.trim();
    if (v && items.length < max) {
      onAdd(v);
      setInput('');
    }
  };

  const itemBg: Record<ChipVariant, string> = {
    gold: 'bg-yellow-400/5 border border-yellow-400/20',
    red: 'bg-red-400/5 border border-red-400/20',
    gray: 'bg-gray-900 border border-gray-800',
  };

  const numColor: Record<ChipVariant, string> = {
    gold: 'text-yellow-400',
    red: 'text-red-400',
    gray: 'text-gray-500',
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="label-text">
          {label}
          <span
            className={`ml-2 text-xs font-normal ${items.length >= min ? 'text-green-400' : 'text-gray-600'}`}
          >
            {items.length}/{min} mÃ­n.
          </span>
        </Label>
        {description && <p className="helper-text">{description}</p>}
      </div>

      {items.length < max && (
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            aria-label={`Agregar a ${label}`}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg group ${itemBg[variant]}`}
            >
              <span className={`text-xs font-mono mt-0.5 flex-shrink-0 ${numColor[variant]}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm text-gray-200">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 flex-shrink-0"
                aria-label={`Eliminar "${item}"`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length < min && (
        <p className="error-text">Faltan {min - items.length} elemento(s)</p>
      )}
    </div>
  );
}

export function PhilosophySection({
  creenciasFundamentales,
  queRechaza,
  limitesEticos,
  propositoMarca,
  historiaOrigen,
  historiaBatallas,
  historiaLogros,
  onUpdate,
}: PhilosophySectionProps) {
  const [creenciasSugs, setCreenciasSugs] = useState<string[]>([]);
  const [creenciasLoading, setCreenciasLoading] = useState(false);

  const handlePredictCreencias = useCallback(async () => {
    if (creenciasSugs.length > 0) { setCreenciasSugs([]); return; }
    setCreenciasLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo: 'creenciasFundamentales',
          contexto: { propositoMarca, creenciasExistentes: creenciasFundamentales.join(', ') },
        }),
      });
      const data = await res.json();
      setCreenciasSugs(Array.isArray(data.sugerencias) ? data.sugerencias : []);
    } catch {
      setCreenciasSugs([]);
    }
    setCreenciasLoading(false);
  }, [creenciasSugs.length, propositoMarca, creenciasFundamentales]);

  return (
    <div className="space-y-8">
      {/* PropÃ³sito de marca */}
      <div className="space-y-3">
        <div className="field-group">
          <Label htmlFor="propositoMarca" className="label-text">
            PropÃ³sito de la marca *
          </Label>
          <p className="helper-text">
            El &quot;por quÃ©&quot; mÃ¡s profundo â€” mÃ¡s allÃ¡ de hacer dinero.
          </p>
        </div>

        {/* FÃ³rmula helper */}
        <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          <p className="text-xs font-semibold text-yellow-400 mb-2">
            Tip: completa esta fÃ³rmula para inspirarte
          </p>
          <p className="text-xs text-yellow-400/70 leading-relaxed italic">
            &quot;Existimos para{' '}
            <span className="font-semibold text-yellow-400">[verbo de acciÃ³n]</span> a{' '}
            <span className="font-semibold text-yellow-400">[tu audiencia]</span> para que{' '}
            <span className="font-semibold text-yellow-400">[resultado transformacional]</span> y asÃ­{' '}
            <span className="font-semibold text-yellow-400">[impacto mayor]</span>.&quot;
          </p>
        </div>

        <Textarea
          id="propositoMarca"
          className="min-h-[110px]"
          value={propositoMarca}
          onChange={(e) => onUpdate('propositoMarca', e.target.value)}
          placeholder="Democratizar el acceso a educaciÃ³n financiera para jÃ³venes latinoamericanos que nunca recibieron estas herramientas en casa..."
        />
        {propositoMarca.length > 0 && propositoMarca.length < 30 && (
          <p className="error-text">
            Necesitas al menos 30 caracteres ({30 - propositoMarca.length} mÃ¡s)
          </p>
        )}
      </div>

      <div className="section-divider" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-transparent select-none">spacer</span>
          {propositoMarca.length >= 30 && (
            <button
              type="button"
              onClick={handlePredictCreencias}
              className="text-[11px] text-yellow-400/70 hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              <span>âœ¦</span>
              {creenciasLoading ? 'Pensando...' : creenciasSugs.length > 0 ? 'Cerrar' : 'Ideas de arranque'}
            </button>
          )}
        </div>
        {(creenciasSugs.length > 0 || creenciasLoading) && (
          <AISuggestionChips
            suggestions={creenciasSugs}
            loading={creenciasLoading}
            onSelect={(s) => {
              if (!creenciasFundamentales.includes(s) && creenciasFundamentales.length < 7) {
                onUpdate('creenciasFundamentales', [...creenciasFundamentales, s]);
              }
              setCreenciasSugs((prev) => prev.filter((x) => x !== s));
            }}
          />
        )}
        <DynamicList
          label="Creencias fundamentales"
          description="Verdades que tu marca defiende profundamente. Las que guÃ­an cada decisiÃ³n de contenido."
          items={creenciasFundamentales}
          onAdd={(v) => onUpdate('creenciasFundamentales', [...creenciasFundamentales, v])}
          onRemove={(i) =>
            onUpdate('creenciasFundamentales', creenciasFundamentales.filter((_, j) => j !== i))
          }
          placeholder='"Cualquier persona puede aprender a invertir si tiene las herramientas correctas"'
          min={3}
          max={7}
          variant="gold"
        />
      </div>

      <DynamicList
        label="QuÃ© rechaza la marca"
        description="PrÃ¡cticas, actitudes o ideas que tu marca activamente rechaza."
        items={queRechaza}
        onAdd={(v) => onUpdate('queRechaza', [...queRechaza, v])}
        onRemove={(i) => onUpdate('queRechaza', queRechaza.filter((_, j) => j !== i))}
        placeholder='"Los gurÃºs que prometen hacerse rico en 30 dÃ­as sin esfuerzo"'
        min={2}
        max={5}
        variant="red"
      />

      <DynamicList
        label="LÃ­mites Ã©ticos"
        description="LÃ­neas que tu marca jamÃ¡s cruzarÃ­a, por ninguna suma de dinero."
        items={limitesEticos}
        onAdd={(v) => onUpdate('limitesEticos', [...limitesEticos, v])}
        onRemove={(i) => onUpdate('limitesEticos', limitesEticos.filter((_, j) => j !== i))}
        placeholder='"Nunca promover inversiones sin advertir claramente los riesgos"'
        min={2}
        max={5}
        variant="gray"
      />

      <div className="section-divider" />

      {/* Historia de origen */}
      <div className="field-group">
        <Label htmlFor="historiaOrigen" className="label-text">
          Historia de origen{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">
          El momento o experiencia que llevÃ³ a crear esta marca.
        </p>
        <Textarea
          id="historiaOrigen"
          className="mt-2 min-h-[100px]"
          value={historiaOrigen}
          onChange={(e) => onUpdate('historiaOrigen', e.target.value)}
          placeholder="QuÃ© estabas viviendo, quÃ© problema te frustrÃ³ o quÃ© oportunidad viste que nadie mÃ¡s estaba aprovechando..."
        />
      </div>

      {/* Batallas */}
      <div className="field-group">
        <Label htmlFor="historiaBatallas" className="label-text">
          Las batallas mÃ¡s duras que atravesaste{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">
          Momentos difÃ­ciles, fracasos o crisis que superaste. El contenido de vulnerabilidad mÃ¡s poderoso.
        </p>
        <Textarea
          id="historiaBatallas"
          className="mt-2 min-h-[100px]"
          value={historiaBatallas}
          onChange={(e) => onUpdate('historiaBatallas', e.target.value)}
          placeholder="Perder todo mi capital en el primer negocio y tener que volver a empezar desde cero..."
        />
      </div>

      {/* Logros */}
      <div className="field-group">
        <Label htmlFor="historiaLogros" className="label-text">
          Tus mejores logros{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">
          Hitos importantes â€” nÃºmeros, reconocimientos, momentos de quiebre positivos.
        </p>
        <Textarea
          id="historiaLogros"
          className="mt-2 min-h-[100px]"
          value={historiaLogros}
          onChange={(e) => onUpdate('historiaLogros', e.target.value)}
          placeholder="Pasar de $0 a $10k/mes en 8 meses. Hablar en mi primer evento para 500 personas. Ser mencionado en Forbes LATAM..."
        />
      </div>
    </div>
  );
}

