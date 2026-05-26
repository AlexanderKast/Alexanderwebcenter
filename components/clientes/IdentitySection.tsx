// @ts-nocheck
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { BrandType } from '@/types/brand';

interface IdentitySectionProps {
  tipo: BrandType;
  nombreMarca: string;
  expertiseDiferenciador: string;
  anosExperiencia: number;
  ubicacionGeografica: string;
  idiomas: string[];
  industriaNicho: string;
  comoPierciben: string;
  onUpdate: (field: string, value: unknown) => void;
}

export function IdentitySection({
  tipo,
  nombreMarca,
  expertiseDiferenciador,
  anosExperiencia,
  ubicacionGeografica,
  idiomas,
  industriaNicho,
  comoPierciben,
  onUpdate,
}: IdentitySectionProps) {
  const [newIdioma, setNewIdioma] = useState('');

  const addIdioma = () => {
    const trimmed = newIdioma.trim();
    if (trimmed && !idiomas.includes(trimmed)) {
      onUpdate('idiomas', [...idiomas, trimmed]);
      setNewIdioma('');
    }
  };

  const removeIdioma = (idx: number) => {
    onUpdate('idiomas', idiomas.filter((_, i) => i !== idx));
  };

  const brandLabel = tipo === 'personal' ? 'Tu nombre o alias pÃºblico' : 'Nombre de la marca';
  const brandPlaceholder =
    tipo === 'personal'
      ? 'Ej: Carlos MÃ©ndez / @carlomentor'
      : tipo === 'producto'
      ? 'Ej: FinanceFlow / BrandKit Pro'
      : 'Ej: Agencia Crece / Consultora Vivo';

  const expertiseLabel =
    tipo === 'personal' ? 'Tu expertise y diferenciador Ãºnico' : 'Propuesta diferenciadora';
  const expertisePlaceholder =
    tipo === 'personal'
      ? 'Soy contador con 8 aÃ±os en startups. Ayudo a founders a pagar menos impuestos legalmente sin perderse en la burocracia...'
      : tipo === 'producto'
      ? 'Herramienta SaaS que reemplaza 3 apps en una. Ãšnica en LATAM con onboarding en espaÃ±ol y soporte humano 24/7...'
      : 'Agencia boutique enfocada en marcas personales. No tomamos mÃ¡s de 5 clientes al mes. Resultados en 90 dÃ­as o reembolso...';

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        Define los elementos fundamentales. Estos datos aparecen en todos los documentos generados â€” sÃ© exacto.
      </p>

      {/* Nombre de marca */}
      <div className="field-group">
        <Label htmlFor="nombreMarca" className="label-text">
          {brandLabel} *
        </Label>
        <p className="helper-text">El nombre exacto que usaremos en todos los documentos.</p>
        <Input
          id="nombreMarca"
          className="mt-2"
          value={nombreMarca}
          onChange={(e) => onUpdate('nombreMarca', e.target.value)}
          placeholder={brandPlaceholder}
        />
      </div>

      {/* Industria / Nicho */}
      <div className="field-group">
        <Label htmlFor="industriaNicho" className="label-text">
          Industria / Nicho *
        </Label>
        <p className="helper-text">
          SÃ© especÃ­fico: no solo &quot;marketing&quot; sino &quot;marketing digital para tiendas de ropa femenina&quot;.
        </p>
        <Input
          id="industriaNicho"
          className="mt-2"
          value={industriaNicho}
          onChange={(e) => onUpdate('industriaNicho', e.target.value)}
          placeholder="Ej: Finanzas personales para millennials / Coaching de ventas B2B"
        />
      </div>

      {/* Expertise diferenciador */}
      <div className="field-group">
        <Label htmlFor="expertiseDiferenciador" className="label-text">
          {expertiseLabel} *
        </Label>
        <p className="helper-text">
          Lo que te hace ÃšNICO. Menciona aÃ±os de experiencia, resultados concretos o metodologÃ­as propias.
        </p>
        <Textarea
          id="expertiseDiferenciador"
          className="mt-2 min-h-[110px]"
          value={expertiseDiferenciador}
          onChange={(e) => onUpdate('expertiseDiferenciador', e.target.value)}
          placeholder={expertisePlaceholder}
        />
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${expertiseDiferenciador.length >= 10 ? 'text-yellow-400' : 'text-gray-600'}`}>
            {expertiseDiferenciador.length} chars {expertiseDiferenciador.length < 10 ? '(mÃ­n. 10)' : ''}
          </span>
        </div>
      </div>

      {/* Grid: aÃ±os + ubicaciÃ³n */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="field-group">
          <Label htmlFor="anosExperiencia" className="label-text">
            AÃ±os de experiencia
          </Label>
          <p className="helper-text">Pon 0 si estÃ¡s empezando.</p>
          <Input
            id="anosExperiencia"
            type="number"
            className="mt-2 w-28"
            min={0}
            max={50}
            value={anosExperiencia}
            onChange={(e) => onUpdate('anosExperiencia', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="field-group">
          <Label htmlFor="ubicacionGeografica" className="label-text">
            UbicaciÃ³n / Mercado *
          </Label>
          <p className="helper-text">PaÃ­s o regiÃ³n principal de operaciÃ³n.</p>
          <Input
            id="ubicacionGeografica"
            className="mt-2"
            value={ubicacionGeografica}
            onChange={(e) => onUpdate('ubicacionGeografica', e.target.value)}
            placeholder="Ej: Colombia, LATAM hispano"
          />
        </div>
      </div>

      {/* CÃ³mo quieres que te perciban */}
      <div className="field-group">
        <Label htmlFor="comoPierciben" className="label-text">
          Â¿CÃ³mo quieres que te perciban?{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">
          Frases literales que te gustarÃ­a que dijera la gente sobre ti.
        </p>
        <Textarea
          id="comoPierciben"
          className="mt-2 min-h-[90px]"
          value={comoPierciben}
          onChange={(e) => onUpdate('comoPierciben', e.target.value)}
          placeholder={`"Cuando quiero aprender de inversiones, siempre pienso en Ã©l primero"\n"Lo que enseÃ±a es prÃ¡ctico, no teorÃ­a"`}
        />
      </div>

      {/* Idiomas */}
      <div className="field-group">
        <Label className="label-text">Idiomas *</Label>
        <p className="helper-text">Los idiomas en los que tu marca produce contenido.</p>
        <div className="flex gap-2 mt-2">
          <Input
            value={newIdioma}
            onChange={(e) => setNewIdioma(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIdioma())}
            placeholder="Ej: EspaÃ±ol, InglÃ©s"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addIdioma}
            aria-label="Agregar idioma"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {idiomas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {idiomas.map((idioma, i) => (
              <span key={i} className="chip chip-gold">
                {idioma}
                <button
                  type="button"
                  onClick={() => removeIdioma(i)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Eliminar ${idioma}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {idiomas.length === 0 && (
          <p className="error-text">Agrega al menos un idioma</p>
        )}
      </div>
    </div>
  );
}

