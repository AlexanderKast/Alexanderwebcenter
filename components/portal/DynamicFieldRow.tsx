'use client';

import { useState, useRef } from 'react';
import { Trash2, ExternalLink, Check } from 'lucide-react';
import { PropertyRow } from '@/components/portal/PropertyRow';
import type { PortalFieldDef } from '@/lib/portal/types';

type Props = {
  fieldDef: PortalFieldDef;
  value: unknown;
  canEdit: boolean;
  onSave: (value: unknown) => void;
  onDeleteDef?: () => void;
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function TextEditor({ value, onSave, placeholder }: { value: string; onSave: (v: string) => void; placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); setTimeout(() => ref.current?.select(), 0); }}
        className="cursor-pointer rounded px-1 py-0.5 text-sm text-white/80 hover:bg-white/5 transition-colors min-h-[1.5rem] inline-block"
      >
        {value || <span className="text-white/25 italic text-xs">{placeholder ?? 'Vacío'}</span>}
      </span>
    );
  }
  return (
    <input
      ref={ref}
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { onSave(draft); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { onSave(draft); setEditing(false); }
        if (e.key === 'Escape') setEditing(false);
      }}
      className="rounded-lg border border-[#D4AF37]/40 bg-white/5 px-2 py-0.5 text-sm text-white focus:outline-none w-full max-w-xs"
    />
  );
}

function NumberEditor({ value, onSave }: { value: string; onSave: (v: unknown) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); setTimeout(() => ref.current?.select(), 0); }}
        className="cursor-pointer rounded px-1 py-0.5 text-sm text-white/80 hover:bg-white/5 transition-colors font-mono min-h-[1.5rem] inline-block"
      >
        {value || <span className="text-white/25 italic text-xs">0</span>}
      </span>
    );
  }
  return (
    <input
      ref={ref}
      autoFocus
      type="number"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { onSave(draft === '' ? null : Number(draft)); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { onSave(draft === '' ? null : Number(draft)); setEditing(false); }
        if (e.key === 'Escape') setEditing(false);
      }}
      className="rounded-lg border border-[#D4AF37]/40 bg-white/5 px-2 py-0.5 text-sm text-white focus:outline-none w-32 font-mono"
    />
  );
}

function UrlDisplay({ value, canEdit, onSave }: { value: string; canEdit: boolean; onSave: (v: unknown) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onSave(draft || null); setEditing(false); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onSave(draft || null); setEditing(false); }
          if (e.key === 'Escape') setEditing(false);
        }}
        placeholder="https://..."
        className="rounded-lg border border-[#D4AF37]/40 bg-white/5 px-2 py-0.5 text-sm text-white focus:outline-none w-full max-w-xs"
      />
    );
  }
  if (!value) {
    return canEdit ? (
      <span onClick={() => setEditing(true)} className="cursor-pointer text-xs text-white/25 italic hover:text-white/50 transition-colors">
        Agregar URL
      </span>
    ) : <span className="text-white/25 text-sm">—</span>;
  }
  const isSafeUrl = /^https?:\/\//i.test(value);
  return (
    <div className="flex items-center gap-2">
      {isSafeUrl ? (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="text-sm text-[#D4AF37]/80 hover:text-[#D4AF37] underline underline-offset-2 truncate max-w-[200px] transition-colors">
          {value}
        </a>
      ) : (
        <span className="text-sm text-white/40 truncate max-w-[200px]">{value}</span>
      )}
      <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
      {canEdit && (
        <button onClick={() => { setDraft(value); setEditing(true); }}
          className="text-[10px] text-white/30 hover:text-white/60 transition-colors">editar</button>
      )}
    </div>
  );
}

function SelectEditor({ value, options, canEdit, onSave }: {
  value: string; options: string[]; canEdit: boolean; onSave: (v: unknown) => void;
}) {
  if (!canEdit) return <span className="text-sm text-white/70">{value || '—'}</span>;
  return (
    <select
      value={value}
      onChange={(e) => onSave(e.target.value || null)}
      className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
    >
      <option value="">—</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function MultiSelectEditor({ value, options, canEdit, onSave }: {
  value: string[]; options: string[]; canEdit: boolean; onSave: (v: unknown) => void;
}) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(opt: string) {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onSave(next.length ? next : null);
  }

  if (!canEdit) {
    if (!selected.length) return <span className="text-sm text-white/30">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {selected.map((s) => (
          <span key={s} className="text-[11px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-md px-1.5 py-0.5 text-[#D4AF37]/70">{s}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => toggle(opt)}
            className={`text-[11px] rounded-md px-1.5 py-0.5 border transition-colors ${
              active
                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]/80'
                : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/25'
            }`}>
            {active && <Check className="w-2.5 h-2.5 inline mr-0.5 -mt-px" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxEditor({ value, canEdit, onSave }: {
  value: boolean; canEdit: boolean; onSave: (v: unknown) => void;
}) {
  return (
    <button
      onClick={() => canEdit && onSave(!value)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
        value
          ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60'
          : 'bg-white/[0.04] border-white/20'
      } ${canEdit ? 'cursor-pointer hover:border-[#D4AF37]/40' : 'cursor-default'}`}
    >
      {value && <Check className="w-3 h-3 text-[#D4AF37]" />}
    </button>
  );
}

export function DynamicFieldRow({ fieldDef, value, canEdit, onSave, onDeleteDef }: Props) {
  const strVal = formatValue(value);

  function renderEditor() {
    switch (fieldDef.field_type) {
      case 'text':
        return <TextEditor value={strVal} onSave={onSave} />;
      case 'number':
        return <NumberEditor value={strVal} onSave={onSave} />;
      case 'url':
        return <UrlDisplay value={strVal} canEdit={canEdit} onSave={onSave} />;
      case 'date':
        if (!canEdit) {
          const parts = strVal.slice(0, 10).split('-');
          return <span className="text-sm text-white/70">{parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : strVal || '—'}</span>;
        }
        return (
          <input
            type="date"
            value={strVal.slice(0, 10)}
            onChange={(e) => onSave(e.target.value || null)}
            className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
          />
        );
      case 'select':
        return <SelectEditor value={strVal} options={fieldDef.options ?? []} canEdit={canEdit} onSave={onSave} />;
      case 'multiselect':
        return <MultiSelectEditor value={Array.isArray(value) ? (value as string[]) : []} options={fieldDef.options ?? []} canEdit={canEdit} onSave={onSave} />;
      case 'checkbox':
        return <CheckboxEditor value={!!value} canEdit={canEdit} onSave={onSave} />;
    }
  }

  return (
    <PropertyRow
      label={fieldDef.name}
      extra={canEdit && onDeleteDef ? (
        <button onClick={onDeleteDef}
          className="opacity-0 group-hover/row:opacity-100 transition-opacity text-red-400/50 hover:text-red-400 ml-1">
          <Trash2 className="w-3 h-3" />
        </button>
      ) : undefined}
    >
      {renderEditor()}
    </PropertyRow>
  );
}
