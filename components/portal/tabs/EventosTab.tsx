'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, ExternalLink, LayoutList, CalendarDays, Tag, MapPin, Users, DollarSign, Link, Calendar, User } from 'lucide-react';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { CalendarGrid } from '@/components/portal/CalendarGrid';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { RelationPicker } from '@/components/portal/RelationPicker';
import { createEvent, updateEvent, deleteEvent, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { PortalEvent, Project, PortalFieldDef } from '@/lib/portal/types';

const ESTADOS: PortalEvent['estado'][] = ['Planificación', 'Inscripción abierta', 'En curso', 'Listo', 'Cancelado'];
const FORMATOS: PortalEvent['formato'][] = ['Virtual', 'En persona', 'Híbrido'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const ESTADO_COLORS: Record<string, string> = {
  'Planificación': '#6b7280',
  'Inscripción abierta': '#D4AF37',
  'En curso': '#3b82f6',
  'Listo': '#22c55e',
  'Cancelado': '#ef4444',
};

// ── Detail panel ─────────────────────────────────────────────────────────────
function EventDetail({ ev, clientId, canEdit, onDelete, projects, fieldDefs }: { ev: PortalEvent; clientId: string; canEdit: boolean; onDelete: () => void; projects: Project[]; fieldDefs: PortalFieldDef[] }) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<PortalEvent>) {
    startTransition(async () => { await updateEvent(ev.id, clientId, patch); });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={ev.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as PortalEvent['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Propietario" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.propietario ?? ''} canEdit={canEdit}
          onSave={(v) => save({ propietario: v || null })} placeholder="Sin asignar" />
      </PropertyRow>
      <PropertyRow label="Categoría" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.categoria ?? ''} canEdit={canEdit}
          onSave={(v) => save({ categoria: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Formato" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.formato ?? ''} type="select" options={FORMATOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ formato: (v as PortalEvent['formato']) || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Fecha" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.fecha_evento ? ev.fecha_evento.slice(0, 16) : ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_evento: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Lugar" icon={<MapPin className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.lugar ?? ''} canEdit={canEdit}
          onSave={(v) => save({ lugar: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Capacidad" icon={<Users className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.capacidad ?? ''} type="number" canEdit={canEdit}
          onSave={(v) => save({ capacidad: parseInt(v) || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Presupuesto" icon={<DollarSign className="w-3.5 h-3.5" />}>
        <InlineCell value={ev.presupuesto ?? ''} type="number" canEdit={canEdit}
          onSave={(v) => save({ presupuesto: parseFloat(v) || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="URL" icon={<Link className="w-3.5 h-3.5" />}>
        <div className="flex items-center gap-2">
          <InlineCell value={ev.url ?? ''} canEdit={canEdit}
            onSave={(v) => save({ url: v || null })} placeholder="—" />
          {/^https?:\/\//i.test(ev.url ?? '') && (
            <a href={ev.url!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37] flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </PropertyRow>

      <PropertyRow label="Proyecto" icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={ev.project_id}
          options={projects.map((p) => ({ id: p.id, label: p.nombre, subtitle: p.estado }))}
          onSelect={(id) => save({ project_id: id })}
          canEdit={canEdit}
          placeholder="Vincular proyecto..."
        />
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
              value={(ev.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(ev.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="event" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar evento
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function EventTable({ events, clientId, canEdit, onOpen }: {
  events: PortalEvent[]; clientId: string; canEdit: boolean; onOpen: (ev: PortalEvent) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <CalendarDays className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin eventos</p>
        <p className="text-white/20 text-xs">Crea el primero con "Nuevo evento"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_130px_90px_1fr] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Formato', 'Fecha'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {events.map((ev, idx) => (
        <div key={ev.id}
          className={`grid grid-cols-[2fr_130px_90px_1fr] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== events.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(ev)}>
          <div className="px-3 py-2.5 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{ev.nombre}</span>
            {ev.lugar && <span className="text-[11px] text-white/30 truncate block">{ev.lugar}</span>}
          </div>
          <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={ev.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateEvent(ev.id, clientId, { estado: v as PortalEvent['estado'] }); }} />
          </div>
          <div className="px-3 py-2 text-xs text-white/40 truncate">{ev.formato ?? '—'}</div>
          <div className="px-3 py-2 text-xs text-white/40">
            {ev.fecha_evento ? new Date(ev.fecha_evento).toLocaleDateString('es-CO') : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create form ───────────────────────────────────────────────────────────────
function NewEventForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState<PortalEvent['estado']>('Planificación');
  const [formato, setFormato] = useState<PortalEvent['formato']>(null);
  const [lugar, setLugar] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createEvent(clientId, {
        nombre: nombre.trim(), fecha_evento: fecha || null, estado,
        formato: formato || null, lugar: lugar || null,
        capacidad: null, presupuesto: null, url: null,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nuevo evento</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none" />
        <select value={estado} onChange={(e) => setEstado(e.target.value as PortalEvent['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={formato ?? ''} onChange={(e) => setFormato((e.target.value as PortalEvent['formato']) || null)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          <option value="">Formato</option>
          {FORMATOS.map((f) => <option key={f ?? ''}>{f}</option>)}
        </select>
        <input value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Lugar"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Crear evento'}
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
export function EventosTab({ events: initialEvents, clientId, canEdit, projects, fieldDefs }: {
  events: PortalEvent[]; clientId: string; canEdit: boolean; projects: Project[]; fieldDefs: PortalFieldDef[];
}) {
  const events = useRealtimeTable<PortalEvent>('portal_events', clientId, initialEvents);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<PortalEvent | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? events.find((e) => e.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? events.filter((ev) => ev.nombre.toLowerCase().includes(search.toLowerCase()))
    : events;

  const calendarEvents = events
    .filter((ev) => ev.fecha_evento)
    .map((ev) => ({
      id: ev.id,
      title: ev.nombre,
      date: ev.fecha_evento!.slice(0, 10),
      color: ESTADO_COLORS[ev.estado] ?? '#D4AF37',
      onClick: () => setSelected(ev),
    }));

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteEvent(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{events.length} evento{events.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar evento..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nuevo evento
          </button>
        )}
      </div>

      {showForm && <NewEventForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && (
        <EventTable events={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />
      )}
      {view === 'calendar' && <CalendarGrid events={calendarEvents} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado}${selectedLive.formato ? ' · ' + selectedLive.formato : ''}` : ''}>
        {selectedLive && (
          <EventDetail ev={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} projects={projects} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
