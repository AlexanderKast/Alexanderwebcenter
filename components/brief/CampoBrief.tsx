'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { conMarca } from '@/lib/brief/schema';
import type { BriefCampo } from '@/types/brief';

interface CampoBriefProps {
  campo: BriefCampo;
  marca: string;
  acento: string;
  valor: string | string[] | undefined;
  conError: boolean;
  onChange: (campo: BriefCampo, valor: string | string[]) => void;
}

/**
 * Un campo del cuestionario. El tipo lo decide el schema, no el componente:
 * agregar una pregunta nueva en content/brief/schema.ts no requiere tocar UI.
 */
export function CampoBrief({ campo, marca, acento, valor, conError, onChange }: CampoBriefProps) {
  const idBase = useId();
  const idControl = `${idBase}-${campo.id}`;
  const idAyuda = campo.h ? `${idControl}-ayuda` : undefined;
  const etiqueta = conMarca(campo.l, marca);

  const claseCampo =
    'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-[15px] text-white placeholder:text-white/25 outline-none transition-colors focus:bg-white/[0.05]';
  const borde = conError ? 'border-red-400/60' : 'border-white/10 focus:border-white/30';

  const esOpciones = campo.ty === 'radio' || campo.ty === 'check';
  const seleccionadas = Array.isArray(valor) ? valor : valor ? [valor] : [];

  function alternarCheck(opcion: string) {
    const actual = Array.isArray(valor) ? valor : [];
    onChange(
      campo,
      actual.includes(opcion) ? actual.filter((v) => v !== opcion) : [...actual, opcion],
    );
  }

  return (
    <div data-campo={campo.id} className="scroll-mt-24">
      {/* En radio/check el grupo se etiqueta con el texto de la pregunta */}
      {esOpciones ? (
        <p id={`${idControl}-label`} className="text-[15px] font-medium text-white">
          {etiqueta}
          {campo.r ? <span className="ml-1 text-amber-400">*</span> : null}
        </p>
      ) : (
        <label htmlFor={idControl} className="block text-[15px] font-medium text-white">
          {etiqueta}
          {campo.r ? <span className="ml-1 text-amber-400">*</span> : null}
        </label>
      )}

      {campo.h && (
        <p id={idAyuda} className="mt-1 text-[13px] leading-relaxed text-white/40">
          {campo.h}
        </p>
      )}

      <div className="mt-2.5">
        {campo.ty === 'area' && (
          <textarea
            id={idControl}
            name={campo.id}
            rows={4}
            value={typeof valor === 'string' ? valor : ''}
            placeholder={campo.ph}
            aria-required={campo.r ? true : undefined}
            aria-invalid={conError || undefined}
            aria-describedby={idAyuda}
            onChange={(e) => onChange(campo, e.target.value)}
            className={`${claseCampo} ${borde} resize-y leading-relaxed`}
          />
        )}

        {(campo.ty === 'text' || campo.ty === 'tel' || campo.ty === 'email') && (
          <input
            id={idControl}
            name={campo.id}
            type={campo.ty === 'text' ? 'text' : campo.ty}
            inputMode={campo.ty === 'tel' ? 'tel' : campo.ty === 'email' ? 'email' : undefined}
            autoComplete={campo.ty === 'tel' ? 'tel' : campo.ty === 'email' ? 'email' : undefined}
            value={typeof valor === 'string' ? valor : ''}
            placeholder={campo.ph}
            aria-required={campo.r ? true : undefined}
            aria-invalid={conError || undefined}
            aria-describedby={idAyuda}
            onChange={(e) => onChange(campo, e.target.value)}
            className={`${claseCampo} ${borde}`}
          />
        )}

        {esOpciones && (
          <div
            role={campo.ty === 'radio' ? 'radiogroup' : 'group'}
            aria-labelledby={`${idControl}-label`}
            aria-describedby={idAyuda}
            className="grid gap-2 sm:grid-cols-2"
          >
            {(campo.o ?? []).map((opcion, i) => {
              const marcada = seleccionadas.includes(opcion);
              const idOpcion = `${idControl}-${i}`;
              return (
                <label
                  key={opcion}
                  htmlFor={idOpcion}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    marcada ? 'text-white' : 'border-white/10 text-white/70 hover:border-white/25'
                  }`}
                  style={marcada ? { borderColor: acento, backgroundColor: `${acento}14` } : undefined}
                >
                  <input
                    id={idOpcion}
                    type={campo.ty === 'radio' ? 'radio' : 'checkbox'}
                    name={campo.id}
                    value={opcion}
                    checked={marcada}
                    onChange={() =>
                      campo.ty === 'radio' ? onChange(campo, opcion) : alternarCheck(opcion)
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                      campo.ty === 'radio' ? 'rounded-full' : 'rounded'
                    }`}
                    style={{
                      borderColor: marcada ? acento : 'rgba(255,255,255,.25)',
                      backgroundColor: marcada ? acento : 'transparent',
                    }}
                  >
                    {marcada && <Check className="h-3 w-3 text-black" />}
                  </span>
                  {opcion}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {conError && (
        <p className="mt-1.5 text-[13px] text-red-300">
          Esta respuesta la necesitamos para avanzar.
        </p>
      )}
    </div>
  );
}
