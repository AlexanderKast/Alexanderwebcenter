'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone, FolderKanban, Target, CalendarDays,
  Share2, BookOpen, CreditCard, Wrench, CheckSquare, Wifi,
} from 'lucide-react';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import type { PortalFieldDef } from '@/lib/portal/types';
import { CampanasTab } from './tabs/CampanasTab';
import { ProyectosTab } from './tabs/ProyectosTab';
import { ObjetivosTab } from './tabs/ObjetivosTab';
import { EventosTab } from './tabs/EventosTab';
import { SocialTab } from './tabs/SocialTab';
import { CalendarioTab } from './tabs/CalendarioTab';
import { CuentasPublicitariasTab } from './tabs/CuentasPublicitariasTab';
import { HerramientasTab } from './tabs/HerramientasTab';
import { TareasTab } from './tabs/TareasTab';
import type { ClientDashboardData, TabId } from '@/lib/portal/types';

const TABS: {
  id: TabId;
  label: string;
  icon: React.ElementType;
  countKey: keyof Omit<ClientDashboardData, 'client'>;
}[] = [
  { id: 'campanas',     label: 'Campañas',      icon: Megaphone,     countKey: 'campaigns' },
  { id: 'proyectos',    label: 'Proyectos',      icon: FolderKanban,  countKey: 'projects' },
  { id: 'objetivos',    label: 'Objetivos',      icon: Target,        countKey: 'objectives' },
  { id: 'tareas',       label: 'Tareas',          icon: CheckSquare,   countKey: 'tasks' },
  { id: 'eventos',      label: 'Eventos',         icon: CalendarDays,  countKey: 'events' },
  { id: 'social',       label: 'Redes',           icon: Share2,        countKey: 'social_posts' },
  { id: 'editorial',    label: 'Calendario',      icon: BookOpen,      countKey: 'editorial' },
  { id: 'cuentas',      label: 'Cuentas pub.',    icon: CreditCard,    countKey: 'ad_accounts' },
  { id: 'herramientas', label: 'Herramientas',    icon: Wrench,        countKey: 'tools' },
];

function LiveIndicator() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse((v) => !v), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/70">
      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 transition-opacity ${pulse ? 'opacity-100' : 'opacity-30'}`} />
      <Wifi className="w-3 h-3" />
      <span>En vivo</span>
    </div>
  );
}

function KPIStrip({ data }: { data: ClientDashboardData }) {
  const proyectosActivos = data.projects.filter((p) => p.estado === 'En curso').length;
  const campanasActivas = data.campaigns.filter((c) => c.estado === 'Activa').length;
  const contenidoPendiente = [
    ...data.editorial.filter((i) => i.estado !== 'Publicado'),
    ...data.social_posts.filter((p) => p.estado !== 'Publicado' && p.estado !== 'Cancelado'),
  ].length;
  const pctObjetivos = data.objectives.length > 0
    ? Math.round((data.objectives.filter((o) => o.estado === 'Listo').length / data.objectives.length) * 100)
    : null;
  const presupuestoTotal = data.campaigns.filter((c) => c.estado === 'Activa').reduce((s, c) => s + (c.presupuesto ?? 0), 0);

  const stats = [
    { label: 'Proyectos activos', value: proyectosActivos, accent: proyectosActivos > 0 ? '#D4AF37' : undefined },
    { label: 'Campañas activas', value: campanasActivas, accent: campanasActivas > 0 ? '#22c55e' : undefined },
    { label: 'Contenido pendiente', value: contenidoPendiente, accent: contenidoPendiente > 5 ? '#f59e0b' : undefined },
    { label: 'OKRs completados', value: pctObjetivos != null ? `${pctObjetivos}%` : '—', accent: pctObjetivos != null && pctObjetivos >= 80 ? '#22c55e' : '#a78bfa' },
    { label: 'Budget activo', value: presupuestoTotal > 0 ? `${Math.round(presupuestoTotal).toLocaleString('es-CO')}` : '—', accent: '#D4AF37' },
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

export function ClientDashboard({
  data,
  canEdit = true,
}: {
  data: ClientDashboardData;
  canEdit?: boolean;
}) {
  const { client } = data;

  const fieldDefs = useRealtimeTable<PortalFieldDef>('portal_field_defs', client.id, data.field_defs);

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab') as TabId;
      if (tab && TABS.some((t) => t.id === tab)) return tab;
    }
    return 'campanas';
  });

  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {client.logo_url ? (
            <img src={client.logo_url} alt={client.nombre}
              className="w-12 h-12 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-lg">{client.nombre.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-white">{client.nombre}</h1>
            <p className="text-sm text-white/40">
              {client.industria && `${client.industria} · `}
              {client.contacto_email ?? client.contacto_nombre}
            </p>
          </div>
        </div>
        <LiveIndicator />
      </div>

      <KPIStrip data={data} />

      {/* Tabs */}
      <div className="border-b border-white/5">
        <nav className="-mb-px flex gap-0 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count = (data[tab.countKey] as unknown[]).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/40 hover:text-white/70 hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                    isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/10 text-white/50'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'campanas' && (
          <CampanasTab campaigns={data.campaigns} clientId={client.id} canEdit={canEdit}
            projects={data.projects} adAccounts={data.ad_accounts}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'campaign')} />
        )}
        {activeTab === 'proyectos' && (
          <ProyectosTab projects={data.projects} clientId={client.id} canEdit={canEdit}
            campaigns={data.campaigns} objectives={data.objectives} events={data.events}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'project')} />
        )}
        {activeTab === 'objetivos' && (
          <ObjetivosTab objectives={data.objectives} clientId={client.id} canEdit={canEdit}
            projects={data.projects}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'objective')} />
        )}
        {activeTab === 'eventos' && (
          <EventosTab events={data.events} clientId={client.id} canEdit={canEdit}
            projects={data.projects}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'event')} />
        )}
        {activeTab === 'social' && (
          <SocialTab posts={data.social_posts} clientId={client.id} canEdit={canEdit}
            campaigns={data.campaigns}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'social_post')} />
        )}
        {activeTab === 'editorial' && (
          <CalendarioTab items={data.editorial} clientId={client.id} canEdit={canEdit}
            campaigns={data.campaigns}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'editorial')} />
        )}
        {activeTab === 'cuentas' && (
          <CuentasPublicitariasTab accounts={data.ad_accounts} clientId={client.id} canEdit={canEdit}
            campaigns={data.campaigns}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'ad_account')} />
        )}
        {activeTab === 'herramientas' && (
          <HerramientasTab tools={data.tools} clientId={client.id} canEdit={canEdit}
            fieldDefs={fieldDefs.filter((f) => f.entity_type === 'tool')} />
        )}
        {activeTab === 'tareas' && (
          <TareasTab initialTasks={data.tasks ?? []} clientId={client.id} canEdit={canEdit} />
        )}
      </div>
    </div>
  );
}
