'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface PageSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageSheet({ open, onClose, title, subtitle, children }: PageSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Bloquear scroll del body cuando el panel está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Resetear scroll al cambiar de ítem (title cambia con cada ítem)
  useEffect(() => {
    if (open) bodyRef.current?.scrollTo({ top: 0 });
  }, [open, title]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={ref}
        className={`fixed inset-y-0 right-0 w-full sm:max-w-xl bg-[#0f0f0f] border-l border-white/10 z-50 flex flex-col
          transition-transform duration-250 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 sticky top-0 bg-[#0f0f0f] z-10">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white truncate leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-white/35 truncate">{subtitle}</p>}
          </div>
        </div>
        {/* Scrollable body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
