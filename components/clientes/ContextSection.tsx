'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, CheckCircle2 } from 'lucide-react';

function OptionalList({
  label,
  description,
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string;
  description: string;
  items: string[];
  placeholder: string;
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const v = input.trim();
    if (v) {
      onAdd(v);
      setInput('');
    }
  };

  return (
    <div className="p-4 border border-gray-800 bg-gray-950/50 rounded-xl space-y-3">
      <div>
        <Label className="label-text">{label}</Label>
        <p className="helper-text">{description}</p>
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="flex-1 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="chip chip-gold">
              {item}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface FigurasReferencia {
  heroInfluencer: string;
  competidoresDirectos: string[];
  creadoresIndustria: string[];
}

interface ContextSectionProps {
  productosSecundarios: string[];
  colaboraciones: string[];
  temporadasEventos: string[];
  restricciones: string[];
  integracionesNecesarias: string[];
  figurasReferencia: FigurasReferencia;
  onUpdate: (field: string, value: unknown) => void;
}

export function ContextSection({
  productosSecundarios,
  colaboraciones,
  temporadasEventos,
  restricciones,
  integracionesNecesarias,
  figurasReferencia,
  onUpdate,
}: ContextSectionProps) {
  const updateFiguras = (key: keyof FigurasReferencia, value: unknown) => {
    onUpdate('figurasReferencia', { ...figurasReferencia, [key]: value });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">
        Sección opcional. Agrega detalles específicos que afinarán el sistema de marca.
      </p>

      {/* Figuras de referencia */}
      <div className="p-5 border border-gray-800 bg-gray-950/50 rounded-xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Figuras de referencia</h3>
          <p className="helper-text">
            Las personas cuyo contenido admiras. Nos ayudan a calibrar el estilo y tono que te atrae.
          </p>
        </div>

        <div className="field-group">
          <Label className="text-xs font-semibold text-gray-400">Tu referente favorito</Label>
          <p className="text-xs text-gray-600 mt-0.5">El creador o figura pública que más admiras y cuyo estilo te gustaría tener como referencia.</p>
          <Input
            className="mt-2 text-sm"
            value={figurasReferencia.heroInfluencer}
            onChange={(e) => updateFiguras('heroInfluencer', e.target.value)}
            placeholder="Ej: @imangazhi / Alex Hormozi / Lex Fridman"
          />
        </div>

        <OptionalList
          label="Competidores directos (hasta 5)"
          description="Personas o marcas que venden algo igual o muy similar a lo tuyo."
          items={figurasReferencia.competidoresDirectos}
          placeholder="Ej: @juanperezcoach"
          onAdd={(v) => updateFiguras('competidoresDirectos', [...figurasReferencia.competidoresDirectos, v])}
          onRemove={(i) => updateFiguras('competidoresDirectos', figurasReferencia.competidoresDirectos.filter((_, j) => j !== i))}
        />

        <OptionalList
          label="Creadores de la industria que inspiran (hasta 5)"
          description="Creadores cuyo contenido te atrae aunque no sean competencia directa."
          items={figurasReferencia.creadoresIndustria}
          placeholder="Ej: @garyvee / @alexhormozi"
          onAdd={(v) => updateFiguras('creadoresIndustria', [...figurasReferencia.creadoresIndustria, v])}
          onRemove={(i) => updateFiguras('creadoresIndustria', figurasReferencia.creadoresIndustria.filter((_, j) => j !== i))}
        />
      </div>

      <OptionalList
        label="Productos o servicios secundarios"
        description="Otras ofertas que existen o están planeadas."
        items={productosSecundarios}
        placeholder="Ej: Curso introductorio ($97)"
        onAdd={(v) => onUpdate('productosSecundarios', [...productosSecundarios, v])}
        onRemove={(i) => onUpdate('productosSecundarios', productosSecundarios.filter((_, j) => j !== i))}
      />

      <OptionalList
        label="Colaboraciones y alianzas"
        description="Partners, marcas aliadas o personas con quienes colaboras."
        items={colaboraciones}
        placeholder="Ej: Podcast de Finanzas Para Todos"
        onAdd={(v) => onUpdate('colaboraciones', [...colaboraciones, v])}
        onRemove={(i) => onUpdate('colaboraciones', colaboraciones.filter((_, j) => j !== i))}
      />

      <OptionalList
        label="Temporadas o eventos especiales"
        description="Fechas importantes: lanzamientos, temporadas altas, webinars recurrentes."
        items={temporadasEventos}
        placeholder="Ej: Webinar gratuito primer viernes del mes"
        onAdd={(v) => onUpdate('temporadasEventos', [...temporadasEventos, v])}
        onRemove={(i) => onUpdate('temporadasEventos', temporadasEventos.filter((_, j) => j !== i))}
      />

      <OptionalList
        label="Restricciones o limitaciones"
        description="Cosas que el sistema NO puede hacer o mencionar."
        items={restricciones}
        placeholder="Ej: No mencionar precios en redes sociales"
        onAdd={(v) => onUpdate('restricciones', [...restricciones, v])}
        onRemove={(i) => onUpdate('restricciones', restricciones.filter((_, j) => j !== i))}
      />

      <OptionalList
        label="¿Qué herramientas usas en tu negocio?"
        description="Plataformas de venta, email, comunidad o automatización que el sistema debe conocer para integrarse."
        items={integracionesNecesarias}
        placeholder="Ej: Mailchimp para emails / Hotmart para ventas / WhatsApp para atención"
        onAdd={(v) => onUpdate('integracionesNecesarias', [...integracionesNecesarias, v])}
        onRemove={(i) => onUpdate('integracionesNecesarias', integracionesNecesarias.filter((_, j) => j !== i))}
      />

      {/* CTA final */}
      <div className="mt-4 p-5 rounded-xl bg-yellow-400/5 border border-yellow-400/25 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-400">¡Listo para enviar!</p>
          <p className="text-sm text-gray-400 mt-0.5">
            Al hacer clic en &ldquo;Enviar y generar&rdquo; tu información quedará guardada en Drive y
            Alexander comenzará a trabajar en tu estrategia de marca.
          </p>
        </div>
      </div>
    </div>
  );
}

