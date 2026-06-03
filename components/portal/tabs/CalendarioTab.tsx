'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, LayoutList, CalendarDays, Tag, Globe, Calendar, FileText, Target } from 'lucide-react';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { CalendarGrid } from '@/components/portal/CalendarGrid';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { RelationPicker } from '@/components/portal/RelationPicker';
import { createEditorialItem, updateEditorialItem, deleteEditorialItem, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { EditorialItem, Campaign, PortalFieldDef } from '@/lib/portal/types';

const PLATAFORMAS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X', 'Blog', 'Email'];
const FORMATOS = ['Video corto', 'Video largo', 'Carrusel', 'Imagen', 'Artículo', 'Email', 'Story'];
const ESTADOS: EditorialItem['estado'][] = ['Pendiente', 'En producción', 'Listo', 'Publicado'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const ESTADO_COLORS: Record<string, string> = {
  Pendiente: '#6b7280', 'En producción': '#f59e0b',
  Listo: '#22c55e', Publicado: '#3b82f6',
};

// ── Detail panel ──────────────────────────────────────────────────────────────
function EditorialDetail({ item, clientId, canEdit, onDelete, campaigns, fieldDefs }: { item: EditorialItem; clientId: string; canEdit: boolean; onDelete: () => void; campaigns: Campaign[]; fieldDefs: PortalFieldDef[] }) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<EditorialItem>) {
    startTransition(async () => { await updateEditorialItem(item.id, clientId, patch); });
  }

  function togglePlataforma(p: string) {
    const cur = item.plataforma ?? [];
    save({ plataforma: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={item.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={item.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as EditorialItem['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Fecha" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={item.fecha ?? ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Formato" icon={<FileText className="w-3.5 h-3.5" />} vertical>
        <div className="flex flex-wrap gap-1.5">
          {FORMATOS.map((f) => (
            <button key={f} type="button"
              onClick={() => canEdit && save({ formato: item.formato === f ? null : f })}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                item.formato === f
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                  : 'border-white/10 text-white/40 hover:border-white/30'
              } ${!canEdit ? 'cursor-default' : 'cursor-pointer'}`}>
              {f}
            </button>
          ))}
        </div>
      </PropertyRow>

      <PropertyRow label="Etapa funnel" icon={<Target className="w-3.5 h-3.5" />} vertical>
        <div className="flex gap-1.5">
          {(['TOFU', 'MOFU', 'BOFU'] as const).map((stage) => (
            <button key={stage} type="button"
              onClick={() => canEdit && save({ funnel_stage: item.funnel_stage === stage ? null : stage })}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                item.funnel_stage === stage
                  ? stage === 'TOFU' ? 'border-blue-400/60 bg-blue-400/10 text-blue-300'
                  : stage === 'MOFU' ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]/80'
                  : 'border-green-400/60 bg-green-400/10 text-green-300'
                  : 'border-white/10 text-white/40 hover:border-white/30'
              } ${!canEdit ? 'cursor-default' : 'cursor-pointer'}`}>
              {stage}
            </button>
          ))}
        </div>
      </PropertyRow>

      <PropertyRow label="Plataformas" icon={<Globe className="w-3.5 h-3.5" />} vertical>
        <div className="flex flex-wrap gap-1.5">
          {PLATAFORMAS.map((p) => (
            <button key={p} type="button"
              onClick={() => canEdit && togglePlataforma(p)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                item.plataforma?.includes(p)
                  ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]/80'
                  : 'border-white/10 text-white/40 hover:border-white/30'
              } ${!canEdit ? 'cursor-default' : 'cursor-pointer'}`}>
              {p}
            </button>
          ))}
        </div>
      </PropertyRow>

      <PropertyRow label="Campaña" icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={item.campaign_id}
          options={campaigns.map((c) => ({ id: c.id, label: c.nombre, subtitle: c.estado }))}
          onSelect={(id) => save({ campaign_id: id })}
          canEdit={canEdit}
          placeholder="Vincular campaña..."
        />
      </PropertyRow>

      <PropertyRow label="Notas" icon={<FileText className="w-3.5 h-3.5" />} vertical>
        {canEdit ? (
          <textarea
            defaultValue={item.notas ?? ''}
            onBlur={(e) => save({ notas: e.target.value || null })}
            rows={3}
            placeholder="Añadir notas..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-white/60">{item.notas || '—'}</p>
        )}
      </PropertyRow>

      {(fieldDefs.length > 0 || canEdit) && (
        <div className="pt-4 space-y-0">
          {fieldDefs.length > 0 && (
            <p className="text-[10px] text-white/25 uppercase tracking-wider pb-1 pt-2">Campos personalizados</p>
          )}
          {fieldDefs.map((def) => (
            <DynamicFieldRow
              key={def.id}
              fieldDef={def}
              value={(item.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(item.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="editorial" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar contenido
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function EditorialTable({ items, clientId, canEdit, onOpen }: {
  items: EditorialItem[]; clientId: string; canEdit: boolean; onOpen: (i: EditorialItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <CalendarDays className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Calendario editorial vacío</p>
        <p className="text-white/20 text-xs">Agrega tu primer contenido con "Agregar contenido"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_120px_100px_90px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Formato', 'Fecha'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {items.map((item, idx) => (
        <div key={item.id}
          className={`grid grid-cols-[2fr_120px_100px_90px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== items.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(item)}>
          <div className="px-3 py-2.5 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{item.nombre}</span>
            {item.plataforma && item.plataforma.length > 0 && (
              <span className="text-[11px] text-[#D4AF37]/50 truncate block">{item.plataforma.slice(0, 2).join(', ')}{item.plataforma.length > 2 ? ` +${item.plataforma.length - 2}` : ''}</span>
            )}
            {item.funnel_stage && (
              <span className={`text-[10px] rounded-full border px-1.5 py-0.5 font-medium ${
                item.funnel_stage === 'TOFU' ? 'border-blue-400/20 text-blue-400/70 bg-blue-400/5'
                : item.funnel_stage === 'MOFU' ? 'border-[#D4AF37]/20 text-[#D4AF37]/70 bg-[#D4AF37]/5'
                : 'border-green-400/20 text-green-400/70 bg-green-400/5'
              }`}>{item.funnel_stage}</span>
            )}
          </div>
          <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={item.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateEditorialItem(item.id, clientId, { estado: v as EditorialItem['estado'] }); }} />
          </div>
          <div className="px-3 py-2 text-xs text-white/40 truncate">{item.formato ?? '—'}</div>
          <div className="px-3 py-2 text-xs text-white/40">
            {item.fecha ? new Date(item.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create form ───────────────────────────────────────────────────────────────
function NewCalForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [formato, setFormato] = useState('');
  const [estado, setEstado] = useState<EditorialItem['estado']>('Pendiente');
  const [funnelStage, setFunnelStage] = useState<'TOFU' | 'MOFU' | 'BOFU' | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createEditorialItem(clientId, {
        nombre: nombre.trim(), fecha: fecha || null, formato: formato || null,
        plataforma: null, estado, notas: null, funnel_stage: funnelStage,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nuevo contenido</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none" />
        <select value={estado} onChange={(e) => setEstado(e.target.value as EditorialItem['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <p className="text-[11px] text-white/40 mb-1.5">Formato</p>
        <div className="flex flex-wrap gap-1.5">
          {FORMATOS.map((f) => (
            <button key={f} type="button" onClick={() => setFormato(formato === f ? '' : f)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${formato === f ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] text-white/40 mb-1.5">Etapa funnel</p>
        <div className="flex gap-1.5">
          {(['TOFU', 'MOFU', 'BOFU'] as const).map((stage) => (
            <button key={stage} type="button"
              onClick={() => setFunnelStage(funnelStage === stage ? null : stage)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                funnelStage === stage
                  ? stage === 'TOFU' ? 'border-blue-400/60 bg-blue-400/10 text-blue-300'
                  : stage === 'MOFU' ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]/80'
                  : 'border-green-400/60 bg-green-400/10 text-green-300'
                  : 'border-white/10 text-white/50 hover:border-white/30'
              }`}>
              {stage}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Agregar'}
        </button>
        <button type="button" onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function CalendarioTab({ items: initialItems, clientId, canEdit, campaigns, fieldDefs }: {
  items: EditorialItem[]; clientId: string; canEdit: boolean; campaigns: Campaign[]; fieldDefs: PortalFieldDef[];
}) {
  const items = useRealtimeTable<EditorialItem>('portal_editorial', clientId, initialItems);
  const [view, setView] = useState('calendar');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<EditorialItem | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? items.find((i) => i.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? items.filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase()))
    : items;

  const calendarEvents = items
    .filter((i) => i.fecha)
    .map((i) => ({
      id: i.id, title: i.nombre, date: i.fecha!.slice(0, 10),
      color: ESTADO_COLORS[i.estado] ?? '#D4AF37',
      onClick: () => setSelected(i),
    }));

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteEditorialItem(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{items.length} pieza{items.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contenido..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Agregar contenido
          </button>
        )}
      </div>

      {showForm && <NewCalForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && <EditorialTable items={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />}
      {view === 'calendar' && <CalendarGrid events={calendarEvents} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado}${selectedLive.formato ? ' · ' + selectedLive.formato : ''}` : ''}>
        {selectedLive && (
          <EditorialDetail item={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} campaigns={campaigns} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
