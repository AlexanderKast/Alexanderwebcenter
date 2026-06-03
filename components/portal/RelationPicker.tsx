'use client';

import { useState, useRef, useEffect } from 'react';
import { Link2, X, Search, ChevronDown } from 'lucide-react';

export interface RelationOption {
  id: string;
  label: string;
  subtitle?: string;
}

interface RelationPickerProps {
  value: string | null;
  options: RelationOption[];
  onSelect: (id: string | null) => void;
  canEdit: boolean;
  placeholder?: string;
}

export function RelationPicker({
  value,
  options,
  onSelect,
  canEdit,
  placeholder = 'Vincular...',
}: RelationPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  if (!canEdit) {
    return selected ? (
      <span className="flex items-center gap-1.5 text-sm text-white/80">
        <Link2 className="w-3 h-3 text-[#D4AF37]/50 flex-shrink-0" />
        {selected.label}
      </span>
    ) : (
      <span className="text-sm text-white/25">—</span>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Current value */}
      {selected ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-white/80 bg-white/[0.06] border border-white/10 rounded-md px-2 py-0.5 hover:border-white/20 transition-colors"
          >
            <Link2 className="w-3 h-3 text-[#D4AF37]/60 flex-shrink-0" />
            <span className="max-w-[160px] truncate">{selected.label}</span>
          </button>
          <button
            onClick={() => onSelect(null)}
            className="text-white/20 hover:text-red-400/70 transition-colors flex-shrink-0"
            title="Desvincular"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-sm text-white/25 hover:text-white/50 transition-colors"
        >
          <span>{placeholder}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#111] border border-white/12 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/8">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg">
              <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto py-1">
            {value && (
              <button
                onClick={() => { onSelect(null); setOpen(false); setSearch(''); }}
                className="w-full text-left px-3 py-2 text-xs text-red-400/60 hover:bg-white/5 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3 h-3" /> Desvincular
              </button>
            )}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-xs text-white/30 text-center">Sin resultados</p>
            )}
            {filtered.map((o) => (
              <button
                key={o.id}
                onClick={() => { onSelect(o.id); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-2.5 hover:bg-white/[0.05] transition-colors ${
                  o.id === value ? 'bg-[#D4AF37]/8 border-l-2 border-[#D4AF37]' : ''
                }`}
              >
                <p className="text-sm text-white/85 leading-tight">{o.label}</p>
                {o.subtitle && <p className="text-[11px] text-white/35 mt-0.5 truncate">{o.subtitle}</p>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
