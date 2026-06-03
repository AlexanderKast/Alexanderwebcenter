'use client';

import { useState, useTransition } from 'react';
import {
  Plus, Trash2, LayoutList, Columns, Users2, ExternalLink,
  Tag, User, Flag, Calendar, FileText, AlertTriangle, Link2,
} from 'lucide-react';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { KanbanBoard } from '@/components/portal/KanbanBoard';
import type { KanbanColumn } from '@/components/portal/KanbanBoard';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { createTask, updateTask, deleteTask } from '@/lib/portal/actions';
import type { PortalTask } from '@/lib/portal/types';

// ── Constants ──────────────────────────────────────────────────────────────────
const ESTADOS = ['Pendiente', 'En progreso', 'En revisión', 'Aprobado', 'Entregado'] as const;
const PRIORIDADES = ['Alta', 'Media', 'Baja'] as const;
const TIPOS = [
  'Video', 'Diseño', 'Copy', 'Edición', 'Estrategia',
  'Pauta', 'Community Management', 'Fotografía', 'Animación', 'Otro',
] as const;
const ROLES = [
  'Growth Junior', 'Growth Senior', 'Community Manager',
  'Diseñador/a', 'Editor/a de Video', 'Estratega', 'Otro',
] as const;

const KANBAN_COLS = [
  { id: 'Pendiente',   label: 'Pendiente',   color: 'border-white/20' },
  { id: 'En progreso', label: 'En progreso', color: 'border-blue-500/50' },
  { id: 'En revisión', label: 'En revisión', color: 'border-yellow-500/50' },
  { id: 'Aprobado',    label: 'Aprobado',    color: 'border-purple-500/50' },
  { id: 'Entregado',   label: 'Entregado',   color: 'border-green-500/50' },
];

const PRIORIDAD_CLR: Record<string, string> = {
  Alta: 'text-red-400', Media: 'text-yellow-400', Baja: 'text-white/40',
};
const ESTADO_CLR: Record<string, string> = {
  Pendiente: 'bg-white/10 text-white/50',
  'En progreso': 'bg-blue-500/15 text-blue-400',
  'En revisión': 'bg-yellow-500/15 text-yellow-400',
  Aprobado: 'bg-purple-500/15 text-purple-400',
  Entregado: 'bg-green-500/15 text-green-400',
};
const TIPO_CLR: Record<string, string> = {
  Video: 'bg-red-500/10 text-red-400/80',
  Diseño: 'bg-pink-500/10 text-pink-400/80',
  Copy: 'bg-[#D4AF37]/10 text-[#D4AF37]/80',
  Edición: 'bg-orange-500/10 text-orange-400/80',
  Estrategia: 'bg-indigo-500/10 text-indigo-400/80',
  Pauta: 'bg-cyan-500/10 text-cyan-400/80',
  'Community Management': 'bg-emerald-500/10 text-emerald-400/80',
  Fotografía: 'bg-purple-500/10 text-purple-400/80',
  Animación: 'bg-violet-500/10 text-violet-400/80',
  Otro: 'bg-white/10 text-white/50',
};

const VIEWS = [
  { id: 'board', label: 'Tablero', icon: <Columns className="w-3.5 h-3.5" /> },
  { id: 'table', label: 'Tabla',   icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'roles', label: 'Por rol', icon: <Users2 className="w-3.5 h-3.5" /> },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function isOverdue(t: PortalTask) {
  if (!t.fecha_limite || t.estado === 'Entregado' || t.estado === 'Aprobado') return false;
  return new Date(t.fecha_limite) < new Date();
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  const [y, m, day] = d.slice(0, 10).split('-');
  return `${day}/${m}/${y}`;
}

// ── Stats strip ────────────────────────────────────────────────────────────────
function StatsStrip({ tasks }: { tasks: PortalTask[] }) {
  const total      = tasks.length;
  const pendientes = tasks.filter((t) => t.estado === 'Pendiente').length;
  const enRevision = tasks.filter((t) => t.estado === 'En revisión').length;
  const completadas = tasks.filter((t) => t.estado === 'Entregado' || t.estado === 'Aprobado').length;
  const enRiesgo   = tasks.filter(isOverdue).length;

  const stats = [
    { label: 'Total tareas',  value: total,       accent: undefined },
    { label: 'Pendientes',    value: pendientes,  accent: pendientes > 0 ? 'rgba(255,255,255,0.6)' : undefined },
    { label: 'En revisión',   value: enRevision,  accent: enRevision > 0 ? '#f59e0b' : undefined },
    { label: 'Completadas',   value: completadas, accent: completadas > 0 ? '#22c55e' : undefined },
    { label: 'En riesgo',     value: enRiesgo,    accent: enRiesgo > 0 ? '#ef4444' : undefined },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
          <p className="text-[10px] text-white/35 uppercase tracking-wide truncate">{s.label}</p>
          <p className="text-lg font-semibold mt-0.5" style={{ color: s.accent ?? 'rgba(255,255,255,0.8)' }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────────
function TaskDetail({ task, clientId, canEdit, onDelete }: {
  task: PortalTask; clientId: string; canEdit: boolean; onDelete: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<PortalTask>) {
    startTransition(async () => { await updateTask(task.id, clientId, patch); });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={task.titulo}
          canEdit={canEdit}
          onSave={(v) => save({ titulo: v || 'Nueva tarea' })}
          className="text-xl font-semibold text-white"
        />
        {isOverdue(task) && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            Vencida — fecha límite superada
          </div>
        )}
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={task.estado} type="select" options={ESTADOS as unknown as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as PortalTask['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Prioridad" icon={<Flag className="w-3.5 h-3.5" />}>
        <InlineCell value={task.prioridad} type="select" options={PRIORIDADES as unknown as string[]} canEdit={canEdit}
          onSave={(v) => save({ prioridad: v as PortalTask['prioridad'] })} />
      </PropertyRow>

      <PropertyRow label="Tipo de entregable" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={task.tipo_entregable ?? ''} type="select" options={TIPOS as unknown as string[]} canEdit={canEdit}
          onSave={(v) => save({ tipo_entregable: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Asignado a" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={task.asignado_a ?? ''} type="select" options={ROLES as unknown as string[]} canEdit={canEdit}
          onSave={(v) => save({ asignado_a: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Fecha límite" icon={<Calendar className="w-3.5 h-3.5" />}>
        {canEdit ? (
          <input
            type="date"
            value={task.fecha_limite?.slice(0, 10) ?? ''}
            onChange={(e) => save({ fecha_limite: e.target.value || null })}
            className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
          />
        ) : (
          <span className={`text-sm ${isOverdue(task) ? 'text-red-400' : 'text-white/70'}`}>
            {fmtDate(task.fecha_limite)}
          </span>
        )}
      </PropertyRow>

      <PropertyRow label="Fecha entrega real" icon={<Calendar className="w-3.5 h-3.5" />}>
        {canEdit ? (
          <input
            type="date"
            value={task.fecha_entrega?.slice(0, 10) ?? ''}
            onChange={(e) => save({ fecha_entrega: e.target.value || null })}
            className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
          />
        ) : (
          <span className="text-sm text-white/70">{fmtDate(task.fecha_entrega)}</span>
        )}
      </PropertyRow>

      <PropertyRow label="Link de entrega" icon={<Link2 className="w-3.5 h-3.5" />}>
        <div className="flex items-center gap-2 min-w-0">
          <InlineCell value={task.link_entrega ?? ''} canEdit={canEdit}
            onSave={(v) => save({ link_entrega: v || null })} placeholder="https://..." />
          {/^https?:\/\//i.test(task.link_entrega ?? '') && (
            <a href={task.link_entrega!} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 text-[10px] text-[#D4AF37]/60 hover:text-[#D4AF37]">
              <ExternalLink className="w-3 h-3" /> Abrir
            </a>
          )}
        </div>
      </PropertyRow>

      <PropertyRow label="Descripción" icon={<FileText className="w-3.5 h-3.5" />} vertical>
        {canEdit ? (
          <textarea
            defaultValue={task.descripcion ?? ''}
            onBlur={(e) => save({ descripcion: e.target.value || null })}
            rows={3}
            placeholder="Describe la tarea..."
            className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white/80 placeholder-white/25 focus:border-[#D4AF37]/50 focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-white/60 whitespace-pre-wrap">{task.descripcion || '—'}</p>
        )}
      </PropertyRow>

      <PropertyRow label="Notas" icon={<FileText className="w-3.5 h-3.5" />} vertical>
        {canEdit ? (
          <textarea
            defaultValue={task.notas ?? ''}
            onBlur={(e) => save({ notas: e.target.value || null })}
            rows={2}
            placeholder="Notas adicionales..."
            className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white/80 placeholder-white/25 focus:border-[#D4AF37]/50 focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-white/60 whitespace-pre-wrap">{task.notas || '—'}</p>
        )}
      </PropertyRow>

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button
            onClick={onDelete}
            disabled={isPending}
            className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar tarea
          </button>
        </div>
      )}
    </div>
  );
}

// ── Tablero Kanban ─────────────────────────────────────────────────────────────
function BoardView({ tasks, clientId, canEdit, onCardClick }: {
  tasks: PortalTask[]; clientId: string; canEdit: boolean; onCardClick: (id: string) => void;
}) {
  const [, startTransition] = useTransition();

  const columns: KanbanColumn[] = KANBAN_COLS.map((col) => ({
    ...col,
    items: tasks
      .filter((t) => t.estado === col.id)
      .map((t) => ({
        id: t.id,
        title: t.titulo,
        subtitle: t.asignado_a ?? undefined,
        badge: t.tipo_entregable ?? undefined,
        badgeColor: t.tipo_entregable ? TIPO_CLR[t.tipo_entregable] : undefined,
        priority: t.prioridad,
        priorityColor: PRIORIDAD_CLR[t.prioridad],
        meta: t.fecha_limite
          ? [isOverdue(t) ? `⚠ ${fmtDate(t.fecha_limite)}` : fmtDate(t.fecha_limite)]
          : [],
      })),
  }));

  async function onMove(taskId: string, newEstado: string) {
    startTransition(async () => {
      await updateTask(taskId, clientId, { estado: newEstado as PortalTask['estado'] });
    });
  }

  return (
    <KanbanBoard
      columns={columns}
      onMoveItem={onMove}
      canEdit={canEdit}
      onCardClick={onCardClick}
    />
  );
}

// ── Tabla ──────────────────────────────────────────────────────────────────────
function TableView({ tasks, onRowClick }: {
  tasks: PortalTask[]; onRowClick: (id: string) => void;
}) {
  const [filterRol, setFilterRol] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const filtered = tasks.filter((t) =>
    (!filterRol    || t.asignado_a === filterRol) &&
    (!filterTipo   || t.tipo_entregable === filterTipo) &&
    (!filterEstado || t.estado === filterEstado),
  );

  const rolesPresentes = Array.from(new Set(tasks.map((t) => t.asignado_a).filter(Boolean))) as string[];
  const tiposPresentes = Array.from(new Set(tasks.map((t) => t.tipo_entregable).filter(Boolean))) as string[];

  return (
    <div className="space-y-3">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none">
          <option value="">Todos los roles</option>
          {rolesPresentes.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none">
          <option value="">Todos los tipos</option>
          {tiposPresentes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Lista */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-white/25 py-8">No hay tareas con estos filtros</p>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            onClick={() => onRowClick(t.id)}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5 cursor-pointer hover:bg-white/[0.05] hover:border-white/15 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm truncate ${isOverdue(t) ? 'text-red-300/80' : 'text-white/80'}`}>
                  {t.titulo}
                </span>
                {isOverdue(t) && <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />}
              </div>
            </div>
            {t.tipo_entregable && (
              <span className={`hidden sm:inline-block text-[10px] rounded-md px-2 py-0.5 flex-shrink-0 ${TIPO_CLR[t.tipo_entregable] ?? 'bg-white/10 text-white/50'}`}>
                {t.tipo_entregable}
              </span>
            )}
            <span className="hidden md:block text-xs text-white/40 flex-shrink-0 w-36 truncate">
              {t.asignado_a ?? '—'}
            </span>
            <span className={`hidden lg:block text-xs flex-shrink-0 w-24 text-right ${isOverdue(t) ? 'text-red-400' : 'text-white/35'}`}>
              {fmtDate(t.fecha_limite)}
            </span>
            <span className={`text-[10px] rounded-full px-2 py-0.5 flex-shrink-0 ${ESTADO_CLR[t.estado]}`}>
              {t.estado}
            </span>
            <span className={`text-xs flex-shrink-0 ${PRIORIDAD_CLR[t.prioridad]}`}>●</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Por rol ────────────────────────────────────────────────────────────────────
function RolesView({ tasks, onRowClick }: {
  tasks: PortalTask[]; onRowClick: (id: string) => void;
}) {
  const sinAsignar = tasks.filter((t) => !t.asignado_a);
  const rolesConTareas = ROLES.filter((rol) => tasks.some((t) => t.asignado_a === rol));
  const otrosRoles = Array.from(new Set(
    tasks
      .filter((t) => t.asignado_a && !(ROLES as readonly string[]).includes(t.asignado_a))
      .map((t) => t.asignado_a!),
  ));
  const grupos = [...rolesConTareas, ...otrosRoles, ...(sinAsignar.length > 0 ? ['Sin asignar'] : [])];

  if (grupos.length === 0) {
    return <p className="text-center text-sm text-white/25 py-8">No hay tareas</p>;
  }

  return (
    <div className="space-y-4">
      {grupos.map((rol) => {
        const grupTareas = rol === 'Sin asignar' ? sinAsignar : tasks.filter((t) => t.asignado_a === rol);
        const activas   = grupTareas.filter((t) => t.estado === 'Pendiente' || t.estado === 'En progreso').length;
        const enRiesgo  = grupTareas.filter(isOverdue).length;

        return (
          <div key={rol} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#D4AF37]">{rol.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-white/80">{rol}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-white/35">{grupTareas.length} tareas</span>
                {activas > 0 && <span className="text-blue-400/70">{activas} activas</span>}
                {enRiesgo > 0 && <span className="text-red-400">{enRiesgo} en riesgo</span>}
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {grupTareas.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onRowClick(t.id)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    t.estado === 'Entregado' || t.estado === 'Aprobado' ? 'bg-green-500' :
                    t.estado === 'En revisión' ? 'bg-yellow-500' :
                    t.estado === 'En progreso' ? 'bg-blue-500' : 'bg-white/25'
                  }`} />
                  <span className={`flex-1 text-sm truncate ${isOverdue(t) ? 'text-red-300/80' : 'text-white/70'}`}>
                    {t.titulo}
                  </span>
                  {t.tipo_entregable && (
                    <span className={`hidden sm:inline-block text-[10px] rounded-md px-1.5 py-0.5 flex-shrink-0 ${TIPO_CLR[t.tipo_entregable] ?? 'bg-white/10 text-white/50'}`}>
                      {t.tipo_entregable}
                    </span>
                  )}
                  <span className={`text-xs flex-shrink-0 ${isOverdue(t) ? 'text-red-400' : 'text-white/30'}`}>
                    {fmtDate(t.fecha_limite)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function TareasTab({ initialTasks, clientId, canEdit }: {
  initialTasks: PortalTask[]; clientId: string; canEdit: boolean;
}) {
  const tasks = useRealtimeTable<PortalTask>('portal_tasks', clientId, initialTasks);
  const [view, setView] = useState('board');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  function closeSheet() { setSelectedId(null); }

  function handleCreate() {
    startTransition(async () => {
      const res = await createTask(clientId, {
        titulo: 'Nueva tarea',
        estado: 'Pendiente',
        prioridad: 'Media',
      });
      if ('id' in res) setSelectedId(res.id);
    });
  }

  function handleDelete(taskId: string) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    startTransition(async () => {
      await deleteTask(taskId, clientId);
      closeSheet();
    });
  }

  return (
    <div className="space-y-4">
      <StatsStrip tasks={tasks} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
        {canEdit && (
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva tarea
          </button>
        )}
      </div>

      {view === 'board' && (
        <BoardView tasks={tasks} clientId={clientId} canEdit={canEdit} onCardClick={setSelectedId} />
      )}
      {view === 'table' && (
        <TableView tasks={tasks} onRowClick={setSelectedId} />
      )}
      {view === 'roles' && (
        <RolesView tasks={tasks} onRowClick={setSelectedId} />
      )}

      {/* Detail sheet */}
      <PageSheet
        open={!!selectedTask}
        onClose={closeSheet}
        title={selectedTask?.titulo ?? 'Tarea'}
        subtitle={selectedTask
          ? `${selectedTask.asignado_a ?? 'Sin asignar'} · ${selectedTask.estado}`
          : undefined}
      >
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            clientId={clientId}
            canEdit={canEdit}
            onDelete={() => handleDelete(selectedTask.id)}
          />
        )}
      </PageSheet>
    </div>
  );
}
