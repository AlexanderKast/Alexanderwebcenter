'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function formatDateDisplay(raw: string): string {
  const parts = raw.slice(0, 10).split('-');
  if (parts.length !== 3) return raw;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

interface InlineCellProps {
  value: string | number | null;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  onSave: (v: string) => void | Promise<unknown>;
  canEdit: boolean;
  placeholder?: string;
  className?: string;
  emptyLabel?: string;
}

export function InlineCell({
  value,
  type = 'text',
  options = [],
  onSave,
  canEdit,
  placeholder = '—',
  className = '',
  emptyLabel,
}: InlineCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(String(value ?? '')); }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function save() {
    if (draft === String(value ?? '')) { setEditing(false); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      setError('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); save(); }
    if (e.key === 'Escape') { setDraft(String(value ?? '')); setEditing(false); }
  }

  const rawStr = value !== null && value !== undefined ? String(value) : '';
  const displayValue = rawStr.trim() !== ''
    ? (type === 'date' ? formatDateDisplay(rawStr) : rawStr)
    : (emptyLabel ?? placeholder);

  const isEmpty = value === null || value === undefined || String(value).trim() === '';

  if (!canEdit) {
    return <span className={`text-sm ${isEmpty ? 'text-white/25' : 'text-white/80'} ${className}`}>{displayValue}</span>;
  }

  if (saving) {
    return (
      <span className={`flex items-center gap-1 text-sm text-white/40 ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        {displayValue}
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={`group text-left text-sm transition-colors ${
          isEmpty ? 'text-white/25 hover:text-white/50' : 'text-white/80 hover:text-white'
        } ${className}`}
        title="Click para editar"
      >
        <span className="border-b border-transparent group-hover:border-white/20 transition-colors">
          {displayValue}
        </span>
        {error && <span className="ml-1 text-xs text-red-400">{error}</span>}
      </button>
    );
  }

  const baseClass =
    'text-sm bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-md px-2 py-1 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 w-full';

  if (type === 'select') {
    return (
      <select
        ref={inputRef as React.Ref<HTMLSelectElement>}
        value={draft}
        onChange={(e) => { setDraft(e.target.value); }}
        onBlur={save}
        onKeyDown={handleKeyDown}
        className={`${baseClass} ${className}`}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (type === 'textarea') {
    return (
      <textarea
        ref={inputRef as React.Ref<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className={`${baseClass} resize-none ${className}`}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.Ref<HTMLInputElement>}
      type={type}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`${baseClass} ${className}`}
    />
  );
}
