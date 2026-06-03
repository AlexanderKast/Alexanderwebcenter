'use client';

import { useState, useTransition } from 'react';
import {
  Plus, Trash2, ExternalLink, LayoutList, Columns, BarChart2,
  Tag, Globe, DollarSign, Percent, Target, Link, User, CheckSquare, Calendar,
} from 'lucide-react';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { KanbanBoard } from '@/components/portal/KanbanBoard';
import { MetricCard } from '@/components/portal/charts/MetricCard';
import { BarChart } from '@/components/portal/charts/BarChart';
import { DonutChart } from '@/components/portal/charts/DonutChart';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { RelationPicker } from '@/components/portal/RelationPicker';
import { createCampaign, updateCampaign, deleteCampaign, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { Campaign, CampaignChecklist, ChecklistItem, Project, AdAccount, PortalFieldDef } from '@/lib/portal/types';

const CHECKLIST_DEFAULT: CampaignChecklist = {
  estrategia: [
    { id: 'e1', texto: 'Definir el objetivo principal de la campaña', completado: false },
    { id: 'e2', texto: 'Identificar el avatar y el nicho de mercado', completado: false },
    { id: 'e3', texto: 'Seleccionar plataforma', completado: false },
    { id: 'e4', texto: 'Establecer presupuesto total y duración', completado: false },
    { id: 'e5', texto: 'Definir KPI: CTR, CPA, ROAS, CPM', completado: false },
    { id: 'e6', texto: 'Crear los activos creativos', completado: false },
    { id: 'e7', texto: 'Configurar píxel, conversion API y eventos clave', completado: false },
    { id: 'e8', texto: 'Conectar la landing page o funnel', completado: false },
    { id: 'e9', texto: 'Crear estructura de campañas (nombres estandarizados)', completado: false },
  ],
  ejecucion: [
    { id: 'x1', texto: 'Verificar presupuesto y segmentación', completado: false },
    { id: 'x2', texto: 'Activar seguimiento de conversiones', completado: false },
    { id: 'x3', texto: 'Revisar rendimiento a las 24h / 48h / 72h', completado: false },
    { id: 'x4', texto: 'Pausar anuncios con bajo rendimiento (CTR < 1%)', completado: false },
    { id: 'x5', texto: 'Duplicar o escalar los ads ganadores', completado: false },
  ],
  optimizacion: [
    { id: 'o1', texto: 'Evaluar métricas clave: CTR, CPM, CPC, CPA, ROAS', completado: false },
    { id: 'o2', texto: 'Probar nuevos hooks, copies o miniaturas', completado: false },
    { id: 'o3', texto: 'Ajustar segmentación o presupuesto', completado: false },
    { id: 'o4', texto: 'Analizar comentarios y feedback de los usuarios', completado: false },
    { id: 'o5', texto: 'Documentar aprendizajes y oportunidades', completado: false },
  ],
};

const PLATAFORMAS = ['Meta', 'TikTok', 'Google', 'YouTube', 'LinkedIn', 'Pinterest'];
const FASES = ['Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5'];
const ESTADOS: Campaign['estado'][] = ['Borrador', 'Activa', 'Pausada', 'Finalizada'];
const MERCADOS = ['Colombia', 'Ecuador', 'Perú', 'México', 'LATAM', 'Centroamérica', 'USA', 'España'];

const ESTADO_COLORS: Record<string, string> = {
  Activa: 'bg-green-500/15 text-green-400 border-green-500/30',
  Borrador: 'bg-white/8 text-white/50 border-white/15',
  Pausada: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Finalizada: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'board', label: 'Tablero', icon: <Columns className="w-3.5 h-3.5" /> },
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

// ── Campaign detail panel (Notion-style page) ────────────────────────────────
function CampaignDetail({
  c,
  clientId,
  canEdit,
  onDelete,
  projects,
  adAccounts,
  fieldDefs,
}: {
  c: Campaign;
  clientId: string;
  canEdit: boolean;
  onDelete: () => void;
  projects: Project[];
  fieldDefs: PortalFieldDef[];
  adAccounts: AdAccount[];
}) {
  const [isPending, startTransition] = useTransition();

  function save(patch: Partial<Campaign>) {
    startTransition(async () => { await updateCampaign(c.id, clientId, patch); });
  }

  function toggleCheck(section: keyof CampaignChecklist, itemId: string) {
    const updated: CampaignChecklist = {
      ...c.checklist,
      [section]: c.checklist[section].map((item) =>
        item.id === itemId ? { ...item, completado: !item.completado } : item,
      ),
    };
    save({ checklist: updated });
  }

  const totalItems = c.checklist.estrategia.length + c.checklist.ejecucion.length + c.checklist.optimizacion.length;
  const completados =
    c.checklist.estrategia.filter((i) => i.completado).length +
    c.checklist.ejecucion.filter((i) => i.completado).length +
    c.checklist.optimizacion.filter((i) => i.completado).length;
  const pct = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;

  return (
    <div className="space-y-1">
      {/* Editable title */}
      <div className="mb-6">
        <InlineCell
          value={c.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      {/* Properties */}
      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.estado}
          type="select"
          options={ESTADOS as string[]}
          canEdit={canEdit}
          onSave={(v) => save({ estado: v as Campaign['estado'] })}
        />
      </PropertyRow>

      <PropertyRow label="Fase E.S.F.E.R.A" icon={<Target className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.fase_esfera}
          type="select"
          options={['', ...FASES]}
          canEdit={canEdit}
          onSave={(v) => save({ fase_esfera: v || null })}
          placeholder="Sin asignar"
        />
      </PropertyRow>

      <PropertyRow label="Plataformas" icon={<Globe className="w-3.5 h-3.5" />}>
        {canEdit ? (
          <div className="flex flex-wrap gap-1.5">
            {PLATAFORMAS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  const current = c.plataforma ?? [];
                  save({ plataforma: current.includes(p) ? current.filter((x) => x !== p) : [...current, p] });
                }}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
                  (c.plataforma ?? []).includes(p)
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                    : 'border-white/10 text-white/40 hover:border-white/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {(c.plataforma ?? []).map((p) => (
              <span key={p} className="rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 text-[11px] text-[#D4AF37]/80">{p}</span>
            ))}
            {!c.plataforma?.length && <span className="text-sm text-white/25">—</span>}
          </div>
        )}
      </PropertyRow>

      <PropertyRow label="Mercados" icon={<Globe className="w-3.5 h-3.5" />}>
        {canEdit ? (
          <div className="flex flex-wrap gap-1.5">
            {MERCADOS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  const current = c.mercados ?? [];
                  save({ mercados: current.includes(m) ? current.filter((x) => x !== m) : [...current, m] });
                }}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
                  (c.mercados ?? []).includes(m)
                    ? 'border-purple-400/60 bg-purple-400/10 text-purple-300'
                    : 'border-white/10 text-white/40 hover:border-white/30'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {(c.mercados ?? []).map((m) => (
              <span key={m} className="rounded-full bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 text-[11px] text-purple-300">{m}</span>
            ))}
            {!c.mercados?.length && <span className="text-sm text-white/25">—</span>}
          </div>
        )}
      </PropertyRow>

      <PropertyRow label="Objetivo principal" icon={<Target className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.objetivo_principal}
          canEdit={canEdit}
          onSave={(v) => save({ objetivo_principal: v || null })}
          placeholder="Describir objetivo..."
        />
      </PropertyRow>

      <PropertyRow label="Presupuesto" icon={<DollarSign className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.presupuesto}
          type="number"
          canEdit={canEdit}
          onSave={(v) => save({ presupuesto: parseFloat(v) || null })}
          placeholder="0"
        />
      </PropertyRow>

      <PropertyRow label="CTR (%)" icon={<Percent className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.ctr}
          type="number"
          canEdit={canEdit}
          onSave={(v) => save({ ctr: parseFloat(v) || null })}
          placeholder="0"
        />
      </PropertyRow>

      <PropertyRow label="CPC promedio" icon={<DollarSign className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.cpc_promedio}
          type="number"
          canEdit={canEdit}
          onSave={(v) => save({ cpc_promedio: parseFloat(v) || null })}
          placeholder="0"
        />
      </PropertyRow>

      <PropertyRow label="CPA" icon={<DollarSign className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.cpa}
          type="number"
          canEdit={canEdit}
          onSave={(v) => save({ cpa: parseFloat(v) || null })}
          placeholder="0"
        />
      </PropertyRow>

      <PropertyRow label="Landing / Funnel" icon={<Link className="w-3.5 h-3.5" />}>
        <div className="flex items-center gap-2">
          <InlineCell
            value={c.landing_url}
            canEdit={canEdit}
            onSave={(v) => save({ landing_url: v || null })}
            placeholder="https://..."
          />
          {/^https?:\/\//i.test(c.landing_url ?? '') && (
            <a href={c.landing_url!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37]">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </PropertyRow>

      <PropertyRow label="Responsable" icon={<User className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.responsable}
          canEdit={canEdit}
          onSave={(v) => save({ responsable: v || null })}
          placeholder="Sin asignar"
        />
      </PropertyRow>

      <PropertyRow label="Fecha inicio" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={c.fecha_inicio ?? ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_inicio: v || null })} placeholder="—" />
      </PropertyRow>
      <PropertyRow label="Fecha cierre" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={c.fecha_cierre ?? ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_cierre: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Producto" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell
          value={c.producto}
          canEdit={canEdit}
          onSave={(v) => save({ producto: v || null })}
          placeholder="—"
        />
      </PropertyRow>

      <PropertyRow label="Proyecto" icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={c.project_id}
          options={projects.map((p) => ({ id: p.id, label: p.nombre, subtitle: p.estado }))}
          onSelect={(id) => save({ project_id: id })}
          canEdit={canEdit}
          placeholder="Vincular proyecto..."
        />
      </PropertyRow>

      <PropertyRow label="Cuenta pub." icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={c.ad_account_id}
          options={adAccounts.map((a) => ({ id: a.id, label: a.nombre, subtitle: a.plataforma ?? undefined }))}
          onSelect={(id) => save({ ad_account_id: id })}
          canEdit={canEdit}
          placeholder="Vincular cuenta..."
        />
      </PropertyRow>

      {/* Checklist section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-white/70 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
            Checklist
          </p>
          <span className="text-xs text-white/40">{pct}% · {completados}/{totalItems}</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 mb-4">
          <div className="h-full rounded-full bg-[#D4AF37] transition-all" style={{ width: `${pct}%` }} />
        </div>

        {(['estrategia', 'ejecucion', 'optimizacion'] as const).map((sec) => (
          <div key={sec} className="mb-4">
            <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/70 mb-2">
              {sec === 'estrategia' ? 'Estrategia' : sec === 'ejecucion' ? 'Ejecución' : 'Optimización'}
            </p>
            <ul className="space-y-1.5">
              {c.checklist[sec].map((item: ChecklistItem) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <button
                    disabled={!canEdit || isPending}
                    onClick={() => toggleCheck(sec, item.id)}
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-colors ${
                      item.completado ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/20 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {item.completado && (
                      <svg viewBox="0 0 12 12" className="w-full h-full text-black" fill="currentColor">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-xs leading-relaxed ${item.completado ? 'line-through text-white/25' : 'text-white/65'}`}>
                    {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Custom fields */}
      {(fieldDefs.length > 0 || canEdit) && (
        <div className="pt-4 space-y-0">
          {fieldDefs.length > 0 && (
            <p className="text-[10px] text-white/25 uppercase tracking-wider pb-1 pt-2">Campos personalizados</p>
          )}
          {fieldDefs.map((def) => (
            <DynamicFieldRow
              key={def.id}
              fieldDef={def}
              value={(c.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(c.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="campaign" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {/* Delete */}
      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button
            onClick={onDelete}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar campaña
          </button>
        </div>
      )}
    </div>
  );
}

// ── Proper table view ────────────────────────────────────────────────────────
function CampaignTable({
  campaigns,
  clientId,
  canEdit,
  onOpen,
}: {
  campaigns: Campaign[];
  clientId: string;
  canEdit: boolean;
  onOpen: (c: Campaign) => void;
}) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <BarChart2 className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin campañas registradas</p>
        <p className="text-white/20 text-xs">Crea la primera con "Nueva campaña"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-[2fr_120px_1fr_70px_70px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Plataforma', 'CTR', 'CPA'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">
            {h}
          </div>
        ))}
      </div>
      {/* Data rows */}
      {campaigns.map((c, idx) => (
        <div
          key={c.id}
          className={`grid grid-cols-[2fr_120px_1fr_70px_70px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${
            idx !== campaigns.length - 1 ? 'border-b border-white/5' : ''
          }`}
          onClick={() => onOpen(c)}
        >
          {/* Name */}
          <div className="px-3 py-2.5 flex items-center gap-2 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate transition-colors">
              {c.nombre}
            </span>
            {c.fase_esfera && (
              <span className="hidden sm:inline text-[10px] text-[#D4AF37]/60 border border-[#D4AF37]/20 rounded-full px-1.5 py-0.5 flex-shrink-0">
                {c.fase_esfera}
              </span>
            )}
          </div>
          {/* Estado */}
          <div className="px-3 py-2 flex items-center" onClick={(e) => e.stopPropagation()}>
            <InlineCell
              value={c.estado}
              type="select"
              options={ESTADOS as string[]}
              canEdit={canEdit}
              onSave={async (v) => { await updateCampaign(c.id, clientId, { estado: v as Campaign['estado'] }); }}
            />
          </div>
          {/* Plataforma */}
          <div className="px-3 py-2 flex flex-wrap gap-1 min-w-0">
            {(c.plataforma ?? []).slice(0, 2).map((p) => (
              <span key={p} className="text-[10px] text-white/40 bg-white/5 rounded px-1.5 py-0.5">{p}</span>
            ))}
            {(c.plataforma?.length ?? 0) > 2 && (
              <span className="text-[10px] text-white/30">+{(c.plataforma?.length ?? 0) - 2}</span>
            )}
          </div>
          {/* CTR */}
          <div className="px-3 py-2 text-xs text-white/50">
            {c.ctr != null ? `${c.ctr}%` : '—'}
          </div>
          {/* CPA */}
          <div className="px-3 py-2 text-xs text-white/50">
            {c.cpa != null ? `$${c.cpa}` : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function CampaignDashboard({ campaigns }: { campaigns: Campaign[] }) {
  const activas = campaigns.filter((c) => c.estado === 'Activa').length;
  const budgetTotal = campaigns.reduce((s, c) => s + (c.presupuesto ?? 0), 0);
  const avgCtr = campaigns.filter((c) => c.ctr != null).reduce((s, c, _, a) => s + (c.ctr ?? 0) / a.length, 0);

  const COLORS: Record<string, string> = { Activa: '#22c55e', Borrador: '#6b7280', Pausada: '#f59e0b', Finalizada: '#3b82f6' };
  const donutSegs = ESTADOS
    .map((e) => ({ label: e, value: campaigns.filter((c) => c.estado === e).length, color: COLORS[e] }))
    .filter((d) => d.value > 0);

  const plataformaCount: Record<string, number> = {};
  campaigns.forEach((c) => c.plataforma?.forEach((p) => { plataformaCount[p] = (plataformaCount[p] ?? 0) + 1; }));
  const barData = Object.entries(plataformaCount).map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total campañas" value={campaigns.length} />
        <MetricCard label="Activas" value={activas} color="#22c55e" />
        <MetricCard label="Presupuesto total" value={budgetTotal > 0 ? `$${Math.round(budgetTotal).toLocaleString('es-CO')}` : '—'} />
        <MetricCard label="CTR promedio" value={avgCtr > 0 ? `${avgCtr.toFixed(2)}%` : '—'} color="#a78bfa" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {donutSegs.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Estado</p>
            <DonutChart segments={donutSegs} centerValue={campaigns.length} centerLabel="total" />
          </div>
        )}
        {barData.length > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Por plataforma</p>
            <BarChart data={barData} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── New campaign form ────────────────────────────────────────────────────────
function NewCampaignForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState<string[]>([]);
  const [estado, setEstado] = useState<Campaign['estado']>('Borrador');
  const [fase, setFase] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createCampaign(clientId, { nombre: nombre.trim(), plataforma, estado, fase_esfera: fase || null, checklist: CHECKLIST_DEFAULT });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-4 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nueva campaña</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la campaña *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="flex flex-wrap gap-1.5">
        {PLATAFORMAS.map((p) => (
          <button key={p} type="button"
            onClick={() => setPlataforma((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${plataforma.includes(p) ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={estado} onChange={(e) => setEstado(e.target.value as Campaign['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={fase} onChange={(e) => setFase(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          <option value="">Fase E.S.F.E.R.A</option>
          {FASES.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Crear campaña'}
        </button>
        <button type="button" onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CampanasTab({
  campaigns: initialCampaigns,
  clientId,
  canEdit,
  projects,
  adAccounts,
  fieldDefs,
}: {
  campaigns: Campaign[];
  clientId: string;
  canEdit: boolean;
  projects: Project[];
  adAccounts: AdAccount[];
  fieldDefs: PortalFieldDef[];
}) {
  const campaigns = useRealtimeTable<Campaign>('portal_campaigns', clientId, initialCampaigns);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [search, setSearch] = useState('');

  // Keep selected in sync with realtime updates
  const selectedLive = selected ? campaigns.find((c) => c.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? campaigns.filter((c) => c.nombre.toLowerCase().includes(search.toLowerCase()))
    : campaigns;

  const kanbanColumns = ESTADOS.map((estado, i) => ({
    id: estado,
    label: estado,
    color: ['border-gray-500', 'border-green-500', 'border-yellow-500', 'border-blue-500'][i],
    items: campaigns.filter((c) => c.estado === estado).map((c) => ({
      id: c.id,
      title: c.nombre,
      subtitle: c.producto ?? (c.plataforma?.join(', ') ?? undefined),
      badge: c.fase_esfera ?? undefined,
      badgeColor: 'bg-[#D4AF37]/10 text-[#D4AF37]/70',
      meta: [
        c.plataforma?.length ? c.plataforma.join(', ') : '',
        c.presupuesto != null ? `$${c.presupuesto.toLocaleString('es-CO')}` : '',
      ].filter(Boolean),
    })),
  }));

  async function handleMoveItem(itemId: string, newColumnId: string) {
    await updateCampaign(itemId, clientId, { estado: newColumnId as Campaign['estado'] });
  }

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar la campaña "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteCampaign(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar campaña..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva campaña
          </button>
        )}
      </div>

      {showForm && <NewCampaignForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && (
        <CampaignTable
          campaigns={filtered}
          clientId={clientId}
          canEdit={canEdit}
          onOpen={setSelected}
        />
      )}

      {view === 'board' && (
        <KanbanBoard columns={kanbanColumns} onMoveItem={handleMoveItem} canEdit={canEdit}
          onCardClick={(id) => { const c = campaigns.find((x) => x.id === id); if (c) setSelected(c); }} />
      )}

      {view === 'dashboard' && <CampaignDashboard campaigns={campaigns} />}

      {/* Notion-style detail panel */}
      <PageSheet
        open={!!selectedLive}
        onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.plataforma?.join(', ') ?? ''} · ${selectedLive.estado}` : ''}
      >
        {selectedLive && (
          <CampaignDetail
            c={selectedLive}
            clientId={clientId}
            canEdit={canEdit}
            onDelete={handleDelete}
            projects={projects}
            adAccounts={adAccounts}
            fieldDefs={fieldDefs}
          />
        )}
      </PageSheet>
    </div>
  );
}
