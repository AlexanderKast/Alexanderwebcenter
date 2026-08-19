'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { AISuggestionChips } from './AISuggestionChips';

const SOFISTICACION_CARDS = [
  { value: 0, emoji: 'ðŸŒ±', label: 'Principiante total', description: 'Nunca ha oído hablar del tema' },
  { value: 1, emoji: 'ðŸ“–', label: 'Aprendiendo', description: 'Ha escuchado algo pero no sabe bien cómo funciona' },
  { value: 2, emoji: 'ðŸ”§', label: 'Intermedio', description: 'Conoce el tema y ha intentado algo sin mucho éxito' },
  { value: 3, emoji: 'ðŸ“ˆ', label: 'Avanzado', description: 'Ya tiene resultados pero busca optimizar' },
  { value: 4, emoji: 'ðŸš€', label: 'Muy avanzado', description: 'Conoce bien el tema y compara opciones' },
  { value: 5, emoji: 'ðŸ†', label: 'Experto', description: 'Domina el tema y busca soluciones específicas' },
];

interface AudienceSectionProps {
  perfilDemografico: string;
  problemaPrincipal: string;
  resultadoDeseado: string;
  nivelSofisticacion: number;
  objecionesPrincipales: string[];
  competenciaDirecta: string[];
  ventajaCompetitiva: string;
  costoNoActuar: string;
  errorPrincipal: string;
  aQuienNoAyudo: string;
  onUpdate: (field: string, value: unknown) => void;
}

async function fetchPredictions(campo: string, contexto: Record<string, string | string[] | number>): Promise<string[]> {
  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campo, contexto }),
    });
    const data = await res.json();
    return Array.isArray(data.sugerencias) ? data.sugerencias : [];
  } catch {
    return [];
  }
}

export function AudienceSection({
  perfilDemografico,
  problemaPrincipal,
  resultadoDeseado,
  nivelSofisticacion,
  objecionesPrincipales,
  competenciaDirecta,
  ventajaCompetitiva,
  costoNoActuar,
  errorPrincipal,
  aQuienNoAyudo,
  onUpdate,
}: AudienceSectionProps) {
  const [newObjecion, setNewObjecion] = useState('');
  const [newCompetidor, setNewCompetidor] = useState('');

  const [problemaSugs, setProblemasSugs] = useState<string[]>([]);
  const [problemaLoading, setProblemaLoading] = useState(false);
  const [ventajaSugs, setVentajaSugs] = useState<string[]>([]);
  const [ventajaLoading, setVentajaLoading] = useState(false);

  const addObjecion = () => {
    const v = newObjecion.trim();
    if (v && objecionesPrincipales.length < 5) {
      onUpdate('objecionesPrincipales', [...objecionesPrincipales, v]);
      setNewObjecion('');
    }
  };

  const addCompetidor = () => {
    const v = newCompetidor.trim();
    if (v) {
      onUpdate('competenciaDirecta', [...competenciaDirecta, v]);
      setNewCompetidor('');
    }
  };

  const handlePerfilBlur = useCallback(async () => {
    if (perfilDemografico.length < 30 || problemaSugs.length > 0) return;
    setProblemaLoading(true);
    const sugs = await fetchPredictions('problemaPrincipal', { perfilDemografico });
    setProblemasSugs(sugs);
    setProblemaLoading(false);
  }, [perfilDemografico, problemaSugs.length]);

  const handlePredictVentaja = useCallback(async () => {
    if (ventajaSugs.length > 0) { setVentajaSugs([]); return; }
    setVentajaLoading(true);
    const sugs = await fetchPredictions('ventajaCompetitiva', { competenciaDirecta });
    setVentajaSugs(sugs);
    setVentajaLoading(false);
  }, [ventajaSugs.length, competenciaDirecta]);

  return (
    <div className="space-y-6">
      {/* Perfil demográfico */}
      <div className="field-group">
        <Label htmlFor="perfilDemografico" className="label-text">
          ¿Quién es tu cliente ideal? *
        </Label>
        <p className="helper-text">Describe a esa persona perfecta: edad, qué hace, dónde vive, cuánto gana, qué le gusta...</p>
        <Textarea
          id="perfilDemografico"
          className="mt-2 min-h-[100px]"
          value={perfilDemografico}
          onChange={(e) => onUpdate('perfilDemografico', e.target.value)}
          onBlur={handlePerfilBlur}
          placeholder="Hombres y mujeres de 28-45 años, emprendedores o freelancers con ingresos variables, viven en ciudades medianas o grandes de LATAM..."
        />
      </div>

      {/* Problema principal */}
      <div className="field-group">
        <Label htmlFor="problemaPrincipal" className="label-text">
          Problema principal que resuelves *
        </Label>
        <p className="helper-text">¿Cuál es el dolor más grande de tu audiencia que tú resuelves?</p>
        <Textarea
          id="problemaPrincipal"
          className="mt-2 min-h-[80px]"
          value={problemaPrincipal}
          onChange={(e) => onUpdate('problemaPrincipal', e.target.value)}
          placeholder="No saben cómo atraer clientes de forma consistente sin depender de referidos o de pagar ads costosos..."
        />
        <AISuggestionChips
          suggestions={problemaSugs}
          loading={problemaLoading}
          onSelect={(s) => {
            onUpdate('problemaPrincipal', s);
            setProblemasSugs([]);
          }}
        />
      </div>

      {/* Resultado deseado */}
      <div className="field-group">
        <Label htmlFor="resultadoDeseado" className="label-text">
          Resultado deseado por tu audiencia *
        </Label>
        <p className="helper-text">¿Qué quieren lograr? ¿Cómo quieren sentirse después de trabajar contigo?</p>
        <Textarea
          id="resultadoDeseado"
          className="mt-2 min-h-[80px]"
          value={resultadoDeseado}
          onChange={(e) => onUpdate('resultadoDeseado', e.target.value)}
          placeholder="Tener un sistema de contenido que trabaje por ellos, genere leads calificados y les permita escalar sin quemarse..."
        />
      </div>

      {/* Nivel de sofisticación */}
      <div className="p-5 rounded-xl bg-gray-950/50 border border-gray-800 space-y-4">
        <div>
          <Label className="label-text">¿Qué tanto sabe tu cliente del tema? *</Label>
          <p className="helper-text">
            Esto define el vocabulario y la profundidad de tu contenido. Elige la opción que mejor describe a la mayoría de tus clientes.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SOFISTICACION_CARDS.map((card) => {
            const isSelected = nivelSofisticacion === card.value;
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => onUpdate('nivelSofisticacion', card.value)}
                className={`
                  relative p-3 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 focus:outline-none
                  ${isSelected
                    ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_16px_rgba(251,191,36,0.1)]'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
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
                <div className="text-2xl mb-1.5">{card.emoji}</div>
                <div className={`font-semibold text-sm mb-1 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                  {card.label}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{card.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Objeciones */}
      <div className="field-group">
        <Label className="label-text">
          Objeciones principales *
          <span className="ml-2 text-xs font-normal text-gray-500">{objecionesPrincipales.length}/5</span>
        </Label>
        <p className="helper-text">¿Por qué razones dudan o no compran? (mínimo 3, máximo 5)</p>

        {objecionesPrincipales.length < 5 && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newObjecion}
              onChange={(e) => setNewObjecion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjecion())}
              placeholder='Ej: "Es muy caro para lo que ofrece"'
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addObjecion}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {objecionesPrincipales.length > 0 && (
          <div className="space-y-2 mt-3">
            {objecionesPrincipales.map((o, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg group"
              >
                <span className="text-xs font-mono text-yellow-400 flex-shrink-0">{i + 1}</span>
                <span className="flex-1 text-sm text-gray-200">{o}</span>
                <button
                  type="button"
                  onClick={() => onUpdate('objecionesPrincipales', objecionesPrincipales.filter((_, j) => j !== i))}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {objecionesPrincipales.length < 3 && (
          <p className="error-text">Necesitas {3 - objecionesPrincipales.length} objeción(es) más</p>
        )}
      </div>

      {/* Competencia directa */}
      <div className="field-group">
        <Label className="label-text">¿Quién más ofrece algo similar a lo tuyo? *</Label>
        <p className="helper-text">Personas, marcas o empresas con las que tus clientes te comparan o podrían comparar.</p>
        <div className="flex gap-2 mt-2">
          <Input
            value={newCompetidor}
            onChange={(e) => setNewCompetidor(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetidor())}
            placeholder="Nombre de un competidor"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCompetidor}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {competenciaDirecta.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {competenciaDirecta.map((c, i) => (
              <span key={i} className="chip chip-gold">
                {c}
                <button
                  type="button"
                  onClick={() => onUpdate('competenciaDirecta', competenciaDirecta.filter((_, j) => j !== i))}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ventaja competitiva */}
      <div className="field-group">
        <div className="flex items-center justify-between">
          <Label htmlFor="ventajaCompetitiva" className="label-text">
            ¿Por qué te elegirían a ti? *
          </Label>
          {competenciaDirecta.length >= 1 && (
            <button
              type="button"
              onClick={handlePredictVentaja}
              className="text-[11px] text-yellow-400/70 hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              <span>âœ¦</span>
              {ventajaLoading ? 'Pensando...' : ventajaSugs.length > 0 ? 'Cerrar' : 'Ideas de arranque'}
            </button>
          )}
        </div>
        <p className="helper-text">Explica qué hace que tu propuesta sea única. ¿Qué puedes hacer tú que los demás no pueden o no hacen?</p>
        <Textarea
          id="ventajaCompetitiva"
          className="mt-2 min-h-[80px]"
          value={ventajaCompetitiva}
          onChange={(e) => onUpdate('ventajaCompetitiva', e.target.value)}
          placeholder="A diferencia de otros, yo..."
        />
        <AISuggestionChips
          suggestions={ventajaSugs}
          loading={ventajaLoading}
          onSelect={(s) => {
            onUpdate('ventajaCompetitiva', s);
            setVentajaSugs([]);
          }}
        />
      </div>

      {/* Costo de no actuar */}
      <div className="field-group">
        <Label htmlFor="costoNoActuar" className="label-text">
          ¿Cuál es el costo de no actuar? *
        </Label>
        <p className="helper-text">
          Si tu cliente NO resuelve su problema ahora, ¿qué tan mala puede llegar a ser su situación?
        </p>
        <Textarea
          id="costoNoActuar"
          className="mt-2 min-h-[90px]"
          value={costoNoActuar}
          onChange={(e) => onUpdate('costoNoActuar', e.target.value)}
          placeholder="Seguirán perdiendo tiempo y dinero con estrategias que no funcionan. En 12 meses más estarán en el mismo punto..."
        />
      </div>

      {/* Error principal */}
      <div className="field-group">
        <Label htmlFor="errorPrincipal" className="label-text">
          Error principal del cliente *
        </Label>
        <p className="helper-text">
          El error más común que impide que tu cliente ideal consiga los resultados que busca.
        </p>
        <Textarea
          id="errorPrincipal"
          className="mt-2 min-h-[90px]"
          value={errorPrincipal}
          onChange={(e) => onUpdate('errorPrincipal', e.target.value)}
          placeholder="Publicar contenido sin estrategia, sin consistencia, esperando que el algoritmo los ayude..."
        />
      </div>

      {/* A quién no ayudo */}
      <div className="field-group">
        <Label htmlFor="aQuienNoAyudo" className="label-text">
          ¿A quién NO puedes ayudar? *
        </Label>
        <p className="helper-text">
          Ser claro en esto filtra clientes incorrectos y hace más creíble tu propuesta.
        </p>
        <Textarea
          id="aQuienNoAyudo"
          className="mt-2 min-h-[80px]"
          value={aQuienNoAyudo}
          onChange={(e) => onUpdate('aQuienNoAyudo', e.target.value)}
          placeholder="Personas que buscan resultados sin esfuerzo, que no están dispuestas a cambiar hábitos..."
        />
      </div>
    </div>
  );
}

