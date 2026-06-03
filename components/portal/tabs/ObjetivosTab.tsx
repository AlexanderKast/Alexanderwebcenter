'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, LayoutList, BarChart2, Tag, Calendar, User, Flag } from 'lucide-react';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { MetricCard } from '@/components/portal/charts/MetricCard';
import { DonutChart } from '@/components/portal/charts/DonutChart';
import { BarChart } from '@/components/portal/charts/BarChart';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { RelationPicker } from '@/components/portal/RelationPicker';
import { createObjective, updateObjective, deleteObjective, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { Objective, Project, PortalFieldDef } from '@/lib/portal/types';

const ESTADOS: Objective['estado'][] = ['Sin empezar', 'En curso', 'Listo'];
const PRIORIDADES: Objective['prioridad'][] = ['Alta', 'Media', 'Baja'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'dashboard', label: 'OKR', icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

const ESTADO_COLORS: Record<string, string> = {
  'Sin empezar': 'bg-white/8 text-white/50 border-white/15',
  'En curso': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Listo': 'bg-green-500/15 text-green-400 border-green-500/30',
};

// ── Detail panel ─────────────────────────────────────────────────────────────
function ObjectiveDetail({ obj, clientId, canEdit, onDelete, projects, fieldDefs }: {
  obj: Objective; clientId: string; canEdit: boolean; onDelete: () => void; projects: Project[]; fieldDefs: PortalFieldDef[];
}) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<Objective>) {
    startTransition(async () => { await updateObjective(obj.id, clientId, patch); });
  }

  const fillPct = Math.min(obj.progreso, 100);
  const barColor = obj.progreso >= 100 ? 'bg-emerald-500' : obj.progreso >= 60 ? 'bg-yellow-400' : 'bg-[#D4AF37]';
  const isOverdue = obj.fecha_limite && new Date(obj.fecha_limite) < new Date() && obj.estado !== 'Listo';

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell value={obj.nombre} canEdit={canEdit}
          onSave={(v) => save({ nombre: v })} className="text-xl font-semibold text-white" />
        {isOverdue && (
          <span className="inline-block mt-2 text-[11px] text-red-400 border border-red-400/30 rounded-full px-2 py-0.5">
            Vencido
          </span>
        )}
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as Objective['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Prioridad" icon={<Flag className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.prioridad} type="select" options={PRIORIDADES as string[]} canEdit={canEdit}
          onSave={(v) => save({ prioridad: v as Objective['prioridad'] })} />
      </PropertyRow>

      <PropertyRow label="Propietario" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.propietario} canEdit={canEdit}
          onSave={(v) => save({ propietario: v || null })} placeholder="Sin asignar" />
      </PropertyRow>

      <PropertyRow label="Equipo" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.equipo} canEdit={canEdit}
          onSave={(v) => save({ equipo: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Trimestre" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.trimestre} canEdit={canEdit}
          onSave={(v) => save({ trimestre: v || null })} placeholder="ej. T1 2026" />
      </PropertyRow>

      <PropertyRow label="Fecha límite" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.fecha_limite} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_limite: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Valor inicial" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.valor_inicial} type="number" canEdit={canEdit}
          onSave={(v) => save({ valor_inicial: parseFloat(v) || 0 })} />
      </PropertyRow>

      <PropertyRow label="Meta (valor final)" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={obj.valor_final} type="number" canEdit={canEdit}
          onSave={(v) => save({ valor_final: parseFloat(v) || 100 })} />
      </PropertyRow>

      <PropertyRow label="Proyecto" icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={obj.project_id}
          options={projects.map((p) => ({ id: p.id, label: p.nombre, subtitle: p.estado }))}
          onSelect={(id) => save({ project_id: id })}
          canEdit={canEdit}
          placeholder="Vincular proyecto..."
        />
      </PropertyRow>

      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Progreso</span>
          <InlineCell value={obj.progreso} type="number" canEdit={canEdit}
            onSave={(v) => save({ progreso: Math.min(200, Math.max(0, parseInt(v) || 0)) })}
            className="text-right w-16" />
        </div>
        <div className="h-2.5 rounded-full bg-white/10">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${fillPct}%` }} />
        </div>
        <p className="text-[11px] text-white/30">{obj.valor_inicial} → {obj.valor_final}</p>
      </div>

      {(fieldDefs.length > 0 || canEdit) && (
        <div className="pt-4 space-y-0">
          {fieldDefs.length > 0 && (
            <p className="text-[10px] text-white/25 uppercase tracking-wider pb-1 pt-2">Campos personalizados</p>
          )}
          {fieldDefs.map((def) => (
            <DynamicFieldRow
              key={def.id}
              fieldDef={def}
              value={(obj.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(obj.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="objective" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar objetivo
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ────────────────────────────────────────────────────────────────────
function ObjectiveTable({ objectives, clientId, canEdit, onOpen }: {
  objectives: Objective[]; clientId: string; canEdit: boolean; onOpen: (o: Objective) => void;
}) {
  if (objectives.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <BarChart2 className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin objetivos OKR</p>
        <p className="text-white/20 text-xs">Define el primero con "Nuevo objetivo"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_100px_80px_100px_90px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Prioridad', 'Trimestre', 'Progreso'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {objectives.map((obj, idx) => {
        const isOverdue = obj.fecha_limite && new Date(obj.fecha_limite) < new Date() && obj.estado !== 'Listo';
        return (
          <div key={obj.id}
            className={`grid grid-cols-[2fr_100px_80px_100px_90px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== objectives.length - 1 ? 'border-b border-white/5' : ''}`}
            onClick={() => onOpen(obj)}>
            <div className="px-3 py-2.5 min-w-0">
              <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{obj.nombre}</span>
              {isOverdue && <span className="text-[10px] text-red-400">Vencido</span>}
            </div>
            <div className="px-3 py-2 flex items-center" onClick={(e) => e.stopPropagation()}>
              <InlineCell value={obj.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
                onSave={async (v) => { await updateObjective(obj.id, clientId, { estado: v as Objective['estado'] }); }} />
            </div>
            <div className="px-3 py-2 text-xs text-white/50">{obj.prioridad}</div>
            <div className="px-3 py-2 text-xs text-white/40">{obj.trimestre ?? '—'}</div>
            <div className="px-3 py-2">
              <div className="text-[11px] text-white/40 mb-1">{obj.progreso}%</div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#D4AF37] transition-all" style={{ width: `${Math.min(obj.progreso, 100)}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OKRDashboard({ objectives }: { objectives: Objective[] }) {
  const completados = objectives.filter((o) => o.estado === 'Listo').length;
  const enCurso = objectives.filter((o) => o.estado === 'En curso').length;
  const vencidos = objectives.filter((o) => o.fecha_limite && new Date(o.fecha_limite) < new Date() && o.estado !== 'Listo').length;
  const avgProgreso = objectives.length > 0 ? Math.round(objectives.reduce((s, o) => s + o.progreso, 0) / objectives.length) : 0;

  const donutSegs = [
    { label: 'Listo', value: completados, color: '#22c55e' },
    { label: 'En curso', value: enCurso, color: '#D4AF37' },
    { label: 'Sin empezar', value: objectives.filter((o) => o.estado === 'Sin empezar').length, color: '#6b7280' },
  ].filter((s) => s.value > 0);

  const trimestreMap: Record<string, number> = {};
  objectives.forEach((o) => { const t = o.trimestre ?? 'Sin trimestre'; trimestreMap[t] = (trimestreMap[t] ?? 0) + 1; });
  const barData = Object.entries(trimestreMap).map(([label, value]) => ({ label, value, color: '#D4AF37' }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total OKRs" value={objectives.length} />
        <MetricCard label="Completados" value={completados} color="#22c55e" />
        <MetricCard label="Progreso prom." value={`${avgProgreso}%`} color="#a78bfa" />
        <MetricCard label="Vencidos" value={vencidos} color={vencidos > 0 ? '#ef4444' : '#6b7280'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {donutSegs.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Estado</p>
            <DonutChart segments={donutSegs} centerValue={`${avgProgreso}%`} centerLabel="prom." />
          </div>
        )}
        {barData.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Por trimestre</p>
            <BarChart data={barData} />
          </div>
        )}
      </div>
    </div>
  );
}

function NewObjectiveForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [prioridad, setPrioridad] = useState<Objective['prioridad']>('Media');
  const [fechaLimite, setFechaLimite] = useState('');
  const [trimestre, setTrimestre] = useState('');
  const [equipo, setEquipo] = useState('');
  const [valorFinal, setValorFinal] = useState('100');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createObjective(clientId, {
        nombre: nombre.trim(), prioridad, estado: 'Sin empezar',
        fecha_limite: fechaLimite || null, trimestre: trimestre || null,
        equipo: equipo || null, valor_inicial: 0, valor_final: parseFloat(valorFinal) || 100, progreso: 0,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nuevo objetivo</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as Objective['prioridad'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <input type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input value={trimestre} onChange={(e) => setTrimestre(e.target.value)} placeholder="Trimestre (ej. T1)"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
        <input value={equipo} onChange={(e) => setEquipo(e.target.value)} placeholder="Equipo"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Crear objetivo'}
        </button>
        <button type="button" onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function ObjetivosTab({ objectives: initialObjectives, clientId, canEdit, projects, fieldDefs }: {
  objectives: Objective[]; clientId: string; canEdit: boolean; projects: Project[]; fieldDefs: PortalFieldDef[];
}) {
  const objectives = useRealtimeTable<Objective>('portal_objectives', clientId, initialObjectives);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Objective | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? objectives.find((o) => o.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? objectives.filter((o) => o.nombre.toLowerCase().includes(search.toLowerCase()))
    : objectives;

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteObjective(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{objectives.length} objetivo{objectives.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar objetivo..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nuevo objetivo
          </button>
        )}
      </div>

      {showForm && <NewObjectiveForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && <ObjectiveTable objectives={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />}
      {view === 'dashboard' && <OKRDashboard objectives={objectives} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado} · ${selectedLive.trimestre ?? ''}` : ''}>
        {selectedLive && (
          <ObjectiveDetail obj={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} projects={projects} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
