'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, LayoutList, Columns, CalendarDays, User, Flag, Tag, Calendar } from 'lucide-react';
import { ProgressBar } from '@/components/portal/ProgressBar';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { KanbanBoard } from '@/components/portal/KanbanBoard';
import { CalendarGrid } from '@/components/portal/CalendarGrid';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { createProject, updateProject, deleteProject, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { Project, Campaign, Objective, PortalEvent, PortalFieldDef } from '@/lib/portal/types';

const ESTADOS: Project['estado'][] = ['Sin empezar', 'En curso', 'Listo', 'Cancelado'];
const PRIORIDADES: Project['prioridad'][] = ['Alta', 'Media', 'Baja'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'board', label: 'Tablero', icon: <Columns className="w-3.5 h-3.5" /> },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const PRIORIDAD_COLORS: Record<string, string> = {
  Alta: 'text-red-400',
  Media: 'text-yellow-400',
  Baja: 'text-white/40',
};

// ── Detail panel ─────────────────────────────────────────────────────────────
function ProjectDetail({ p, clientId, canEdit, onDelete, campaigns, objectives, events, fieldDefs }: {
  p: Project; clientId: string; canEdit: boolean; onDelete: () => void;
  campaigns: Campaign[]; objectives: Objective[]; events: PortalEvent[]; fieldDefs: PortalFieldDef[];
}) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<Project>) {
    startTransition(async () => { await updateProject(p.id, clientId, patch); });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={p.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={p.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as Project['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Prioridad" icon={<Flag className="w-3.5 h-3.5" />}>
        <InlineCell value={p.prioridad} type="select" options={PRIORIDADES as string[]} canEdit={canEdit}
          onSave={(v) => save({ prioridad: v as Project['prioridad'] })} />
      </PropertyRow>

      <PropertyRow label="Responsable" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={p.responsable} canEdit={canEdit}
          onSave={(v) => save({ responsable: v || null })} placeholder="Sin asignar" />
      </PropertyRow>

      <PropertyRow label="Equipo" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={p.equipo} canEdit={canEdit}
          onSave={(v) => save({ equipo: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Fecha inicio" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={p.fecha_inicio} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_inicio: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Fecha fin" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={p.fecha_fin} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_fin: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Presupuesto" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={p.presupuesto} type="number" canEdit={canEdit}
          onSave={(v) => save({ presupuesto: parseFloat(v) || null })} placeholder="—" />
      </PropertyRow>

      <div className="pt-4">
        <div className="flex items-center justify-between text-xs text-white/40 mb-2">
          <span>Progreso</span>
          <InlineCell value={p.progreso} type="number" canEdit={canEdit}
            onSave={(v) => save({ progreso: Math.min(100, Math.max(0, parseInt(v) || 0)) })}
            className="text-right w-12" />
        </div>
        <ProgressBar value={p.progreso} />
      </div>

      {p.resumen_ia && (
        <div className="pt-4 rounded-lg bg-white/[0.03] border border-white/8 p-3">
          <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1">Resumen IA</p>
          <p className="text-xs text-white/60 leading-relaxed">{p.resumen_ia}</p>
        </div>
      )}

      {/* Reverse relations */}
      {(() => {
        const linkedCampaigns = campaigns.filter((c) => c.project_id === p.id);
        const linkedObjectives = objectives.filter((o) => o.project_id === p.id);
        const linkedEvents = events.filter((e) => e.project_id === p.id);
        if (!linkedCampaigns.length && !linkedObjectives.length && !linkedEvents.length) return null;
        return (
          <div className="pt-4 space-y-3">
            <p className="text-[11px] text-white/35 uppercase tracking-wider">Vinculado</p>
            {linkedCampaigns.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-1.5">Campañas ({linkedCampaigns.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedCampaigns.map((c) => (
                    <span key={c.id} className="flex items-center gap-1 text-[11px] bg-white/[0.05] border border-white/10 rounded-md px-2 py-1 text-white/70">
                      {c.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {linkedObjectives.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-1.5">Objetivos ({linkedObjectives.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedObjectives.map((o) => (
                    <span key={o.id} className="flex items-center gap-1 text-[11px] bg-white/[0.05] border border-white/10 rounded-md px-2 py-1 text-white/70">
                      {o.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {linkedEvents.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-1.5">Eventos ({linkedEvents.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {linkedEvents.map((e) => (
                    <span key={e.id} className="flex items-center gap-1 text-[11px] bg-white/[0.05] border border-white/10 rounded-md px-2 py-1 text-white/70">
                      {e.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {(fieldDefs.length > 0 || canEdit) && (
        <div className="pt-4 space-y-0">
          {fieldDefs.length > 0 && (
            <p className="text-[10px] text-white/25 uppercase tracking-wider pb-1 pt-2">Campos personalizados</p>
          )}
          {fieldDefs.map((def) => (
            <DynamicFieldRow
              key={def.id}
              fieldDef={def}
              value={(p.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(p.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="project" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar proyecto
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ────────────────────────────────────────────────────────────────────
function ProjectTable({ projects, clientId, canEdit, onOpen }: {
  projects: Project[]; clientId: string; canEdit: boolean; onOpen: (p: Project) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <LayoutList className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin proyectos</p>
        <p className="text-white/20 text-xs">Crea el primero con "Nuevo proyecto"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_110px_80px_90px_80px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Prioridad', 'Responsable', 'Progreso'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {projects.map((p, idx) => (
        <div key={p.id}
          className={`grid grid-cols-[2fr_110px_80px_90px_80px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== projects.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(p)}>
          <div className="px-3 py-2.5 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{p.nombre}</span>
            {p.equipo && <span className="text-[11px] text-white/30 truncate block">{p.equipo}</span>}
          </div>
          <div className="px-3 py-2 flex items-center" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={p.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateProject(p.id, clientId, { estado: v as Project['estado'] }); }} />
          </div>
          <div className="px-3 py-2">
            <span className={`text-xs font-medium ${PRIORIDAD_COLORS[p.prioridad] ?? 'text-white/40'}`}>{p.prioridad}</span>
          </div>
          <div className="px-3 py-2 text-xs text-white/40 truncate">{p.responsable ?? '—'}</div>
          <div className="px-3 py-2 min-w-0">
            <div className="text-[11px] text-white/40 mb-1">{p.progreso}%</div>
            <ProgressBar value={p.progreso} />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewProjectForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [responsable, setResponsable] = useState('');
  const [prioridad, setPrioridad] = useState<Project['prioridad']>('Media');
  const [estado, setEstado] = useState<Project['estado']>('Sin empezar');
  const [fechaFin, setFechaFin] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createProject(clientId, { nombre: nombre.trim(), responsable: responsable || null, prioridad, estado, fecha_fin: fechaFin || null, progreso: 0 });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nuevo proyecto</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <input value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Responsable"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as Project['prioridad'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value as Project['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Crear proyecto'}
        </button>
        <button type="button" onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function ProyectosTab({ projects: initialProjects, clientId, canEdit, campaigns, objectives, events, fieldDefs }: {
  projects: Project[]; clientId: string; canEdit: boolean;
  campaigns: Campaign[]; objectives: Objective[]; events: PortalEvent[]; fieldDefs: PortalFieldDef[];
}) {
  const projects = useRealtimeTable<Project>('portal_projects', clientId, initialProjects);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? projects.find((p) => p.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? projects.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
    : projects;

  const STATUS_COL_COLORS: Record<string, string> = {
    'Sin empezar': 'border-gray-500', 'En curso': 'border-blue-500',
    'Listo': 'border-green-500', 'Cancelado': 'border-red-500',
  };

  const kanbanColumns = ESTADOS.map((estado) => ({
    id: estado,
    label: estado,
    color: STATUS_COL_COLORS[estado] ?? 'border-white/20',
    items: projects.filter((p) => p.estado === estado).map((p) => ({
      id: p.id,
      title: p.nombre,
      subtitle: p.responsable ?? undefined,
      badge: p.equipo ? p.equipo : undefined,
      badgeColor: 'bg-white/8 text-white/50',
      progress: p.progreso,
      priority: p.prioridad,
      priorityColor: PRIORIDAD_COLORS[p.prioridad],
      meta: [p.fecha_fin ? `vence ${new Date(p.fecha_fin).toLocaleDateString('es-CO')}` : ''].filter(Boolean),
    })),
  }));

  async function handleMoveItem(itemId: string, newColumnId: string) {
    await updateProject(itemId, clientId, { estado: newColumnId as Project['estado'] });
  }

  const calendarEvents = projects.filter((p) => p.fecha_fin).map((p) => ({
    id: p.id, title: p.nombre, date: p.fecha_fin!.slice(0, 10),
    color: p.prioridad === 'Alta' ? '#ef4444' : p.prioridad === 'Media' ? '#f59e0b' : '#6b7280',
    onClick: () => setSelected(p),
  }));

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteProject(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar proyecto..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nuevo proyecto
          </button>
        )}
      </div>

      {showForm && <NewProjectForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && <ProjectTable projects={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />}
      {view === 'board' && (
        <KanbanBoard columns={kanbanColumns} onMoveItem={handleMoveItem} canEdit={canEdit}
          onCardClick={(id) => { const p = projects.find((x) => x.id === id); if (p) setSelected(p); }} />
      )}
      {view === 'calendar' && <CalendarGrid events={calendarEvents} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado} · ${selectedLive.prioridad} prioridad` : ''}>
        {selectedLive && (
          <ProjectDetail p={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete}
            campaigns={campaigns} objectives={objectives} events={events} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
