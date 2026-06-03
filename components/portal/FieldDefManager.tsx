'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import { createFieldDef } from '@/lib/portal/actions';
import type { EntityType, FieldType } from '@/lib/portal/types';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Fecha' },
  { value: 'url', label: 'URL' },
  { value: 'select', label: 'Selección única' },
  { value: 'multiselect', label: 'Selección múltiple' },
  { value: 'checkbox', label: 'Casilla' },
];

const NEEDS_OPTIONS: FieldType[] = ['select', 'multiselect'];

type Props = {
  entityType: EntityType;
  clientId: string;
  fieldCount: number;
};

export function FieldDefManager({ entityType, clientId, fieldCount }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [optionsRaw, setOptionsRaw] = useState('');
  const [isPending, startTransition] = useTransition();

  function reset() {
    setName('');
    setFieldType('text');
    setOptionsRaw('');
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const options = NEEDS_OPTIONS.includes(fieldType)
      ? optionsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    startTransition(async () => {
      await createFieldDef(clientId, {
        name: name.trim(),
        entity_type: entityType,
        field_type: fieldType,
        options,
        position: fieldCount,
      });
      reset();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mt-1 py-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Agregar campo
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => { if (e.key === 'Escape') reset(); }}
      className="mt-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] p-3 space-y-2.5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#D4AF37]/70">Nuevo campo</p>
        <button type="button" onClick={reset} className="text-white/30 hover:text-white/60 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del campo *"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
      />

      <select
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value as FieldType)}
        className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
      >
        {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      {NEEDS_OPTIONS.includes(fieldType) && (
        <div>
          <input
            value={optionsRaw}
            onChange={(e) => setOptionsRaw(e.target.value)}
            placeholder="Opciones separadas por coma (ej: Opción A, Opción B)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/25 focus:border-[#D4AF37]/50 focus:outline-none"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors"
        >
          {isPending ? 'Guardando...' : 'Crear campo'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
