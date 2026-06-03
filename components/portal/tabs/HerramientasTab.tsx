'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, ExternalLink, LayoutList, BarChart2, Tag, Globe, User, DollarSign, Calendar, Flag, FileText, AlertTriangle } from 'lucide-react';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { MetricCard } from '@/components/portal/charts/MetricCard';
import { DonutChart } from '@/components/portal/charts/DonutChart';
import { BarChart } from '@/components/portal/charts/BarChart';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { createTool, updateTool, deleteTool, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { Tool, PortalFieldDef } from '@/lib/portal/types';

const ESTADOS: Tool['estado'][] = ['Sin Activar', 'Activo', 'Por renovar', 'Cancelado'];
const PRIORIDADES = ['Alta', 'Media', 'Baja'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

const ESTADO_BADGE_COLORS: Record<string, string> = {
  'Sin Activar': '#6b7280', Activo: '#22c55e', 'Por renovar': '#f59e0b', Cancelado: '#ef4444',
};

// ── Detail panel ──────────────────────────────────────────────────────────────
function ToolDetail({ tool, clientId, canEdit, onDelete, fieldDefs }: { tool: Tool; clientId: string; canEdit: boolean; onDelete: () => void; fieldDefs: PortalFieldDef[] }) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<Tool>) {
    startTransition(async () => { await updateTool(tool.id, clientId, patch); });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex-1">
          <InlineCell
            value={tool.nombre}
            canEdit={canEdit}
            onSave={(v) => save({ nombre: v })}
            className="text-xl font-semibold text-white"
          />
          {/^https?:\/\//i.test(tool.url ?? '') && (
            <a href={tool.url!} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#D4AF37]/60 hover:text-[#D4AF37] flex items-center gap-1 mt-1">
              <ExternalLink className="w-3 h-3" /> {tool.url}
            </a>
          )}
        </div>
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as Tool['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Prioridad" icon={<Flag className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.prioridad ?? ''} type="select" options={PRIORIDADES} canEdit={canEdit}
          onSave={(v) => save({ prioridad: (v as Tool['prioridad']) || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Área" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.area ?? ''} canEdit={canEdit}
          onSave={(v) => save({ area: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="URL" icon={<Globe className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.url ?? ''} canEdit={canEdit}
          onSave={(v) => save({ url: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Usuario" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.usuario ?? ''} canEdit={canEdit}
          onSave={(v) => save({ usuario: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Valor USD/mes" icon={<DollarSign className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.valor ?? ''} type="number" canEdit={canEdit}
          onSave={(v) => save({ valor: parseFloat(v) || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Fecha compra" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={tool.fecha_compra ?? ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_compra: v || null })} placeholder="—" />
      </PropertyRow>

      {(tool.resumen_ia || canEdit) && (
        <PropertyRow label="Descripción" icon={<FileText className="w-3.5 h-3.5" />} vertical>
          {canEdit ? (
            <textarea
              defaultValue={tool.resumen_ia ?? ''}
              onBlur={(e) => save({ resumen_ia: e.target.value || null })}
              rows={3}
              placeholder="Descripción de la herramienta..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none resize-none"
            />
          ) : (
            <p className="text-sm text-white/60 leading-relaxed">{tool.resumen_ia}</p>
          )}
        </PropertyRow>
      )}

      {(fieldDefs.length > 0 || canEdit) && (
        <div className="pt-4 space-y-0">
          {fieldDefs.length > 0 && (
            <p className="text-[10px] text-white/25 uppercase tracking-wider pb-1 pt-2">Campos personalizados</p>
          )}
          {fieldDefs.map((def) => (
            <DynamicFieldRow
              key={def.id}
              fieldDef={def}
              value={(tool.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(tool.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="tool" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar herramienta
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function ToolTable({ tools, clientId, canEdit, onOpen }: {
  tools: Tool[]; clientId: string; canEdit: boolean; onOpen: (t: Tool) => void;
}) {
  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <BarChart2 className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin herramientas registradas</p>
        <p className="text-white/20 text-xs">Agrega la primera con "Nueva herramienta"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_110px_100px_90px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Área', 'USD/mes'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {tools.map((tool, idx) => (
        <div key={tool.id}
          className={`grid grid-cols-[2fr_110px_100px_90px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${
            tool.estado === 'Por renovar' ? 'border-l-2 border-l-amber-500/60 bg-amber-500/[0.03]' : ''
          } ${idx !== tools.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(tool)}>
          <div className="px-3 py-2.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-white/80 group-hover:text-white truncate transition-colors">{tool.nombre}</span>
              {tool.url && <ExternalLink className="w-3 h-3 text-white/20 flex-shrink-0" />}
              {tool.estado === 'Por renovar' && <AlertTriangle className="w-3 h-3 text-amber-400/70 flex-shrink-0" />}
            </div>
            {tool.usuario && <span className="text-[11px] text-white/30 truncate block">{tool.usuario}</span>}
          </div>
          <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={tool.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateTool(tool.id, clientId, { estado: v as Tool['estado'] }); }} />
          </div>
          <div className="px-3 py-2 text-xs text-white/40 truncate">{tool.area ?? '—'}</div>
          <div className="px-3 py-2 text-xs text-[#D4AF37]/60">
            {tool.valor != null ? `$${tool.valor.toLocaleString('es-CO')}` : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function ToolDashboard({ tools }: { tools: Tool[] }) {
  const activas = tools.filter((t) => t.estado === 'Activo');
  const costoTotal = activas.reduce((s, t) => s + (t.valor ?? 0), 0);
  const porRenovar = tools.filter((t) => t.estado === 'Por renovar').length;

  const donutSegs = ESTADOS.map((e) => ({
    label: e, value: tools.filter((t) => t.estado === e).length, color: ESTADO_BADGE_COLORS[e],
  })).filter((s) => s.value > 0);

  const areaMap: Record<string, number> = {};
  tools.forEach((t) => { const a = t.area ?? 'Sin área'; areaMap[a] = (areaMap[a] ?? 0) + 1; });
  const barData = Object.entries(areaMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total" value={tools.length} />
        <MetricCard label="Activas" value={activas.length} color="#22c55e" />
        <MetricCard label="Costo/mes" value={costoTotal > 0 ? `$${costoTotal.toLocaleString('es-CO')}` : '—'} color="#D4AF37" />
        <MetricCard label="Por renovar" value={porRenovar} color={porRenovar > 0 ? '#f59e0b' : '#6b7280'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {donutSegs.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Estado</p>
            <DonutChart segments={donutSegs} centerValue={tools.length} centerLabel="total" />
          </div>
        )}
        {barData.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Por área</p>
            <BarChart data={barData} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create form ───────────────────────────────────────────────────────────────
function NewToolForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState('');
  const [estado, setEstado] = useState<Tool['estado']>('Sin Activar');
  const [valor, setValor] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createTool(clientId, {
        nombre: nombre.trim(), area: area || null, estado,
        url: null, usuario: null, valor: valor ? parseFloat(valor) : null,
        resumen_ia: null, prioridad: null,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nueva herramienta</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-3 gap-3">
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Área"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
        <select value={estado} onChange={(e) => setEstado(e.target.value as Tool['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="USD/mes"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Agregar herramienta'}
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
export function HerramientasTab({ tools: initialTools, clientId, canEdit, fieldDefs }: {
  tools: Tool[]; clientId: string; canEdit: boolean; fieldDefs: PortalFieldDef[];
}) {
  const tools = useRealtimeTable<Tool>('portal_tools', clientId, initialTools);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Tool | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? tools.find((t) => t.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? tools.filter((t) => t.nombre.toLowerCase().includes(search.toLowerCase()))
    : tools;

  const costoTotal = tools.filter((t) => t.estado === 'Activo' && t.valor != null).reduce((acc, t) => acc + (t.valor ?? 0), 0);

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteTool(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          {costoTotal > 0 && <span className="text-xs text-[#D4AF37]/70">${costoTotal.toLocaleString('es-CO')} USD/mes</span>}
          <span className="text-xs text-white/30">{tools.length} herramienta{tools.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar herramienta..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-44"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva herramienta
          </button>
        )}
      </div>

      {showForm && <NewToolForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && <ToolTable tools={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />}
      {view === 'dashboard' && <ToolDashboard tools={tools} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado}${selectedLive.area ? ' · ' + selectedLive.area : ''}` : ''}>
        {selectedLive && (
          <ToolDetail tool={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
