'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, ExternalLink, LayoutList, Columns, CalendarDays, Tag, Calendar, Globe, Users, Link } from 'lucide-react';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { KanbanBoard } from '@/components/portal/KanbanBoard';
import { CalendarGrid } from '@/components/portal/CalendarGrid';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { RelationPicker } from '@/components/portal/RelationPicker';
import { createSocialPost, updateSocialPost, deleteSocialPost, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { SocialPost, Campaign, PortalFieldDef } from '@/lib/portal/types';

const PLATAFORMAS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X', 'Facebook', 'Pinterest'];
const TIPOS = ['Video', 'Carrusel', 'Imagen', 'Texto', 'Story', 'Reel', 'Live'];
const ESTADOS: SocialPost['estado'][] = ['Idea', 'En producción', 'Programado', 'Publicado', 'Cancelado'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
  { id: 'board', label: 'Tablero', icon: <Columns className="w-3.5 h-3.5" /> },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

const ESTADO_COLORS: Record<string, string> = {
  Idea: '#6b7280', 'En producción': '#f59e0b',
  Programado: '#3b82f6', Publicado: '#22c55e', Cancelado: '#ef4444',
};

// ── Detail panel ──────────────────────────────────────────────────────────────
function PostDetail({ post, clientId, canEdit, onDelete, campaigns, fieldDefs }: { post: SocialPost; clientId: string; canEdit: boolean; onDelete: () => void; campaigns: Campaign[]; fieldDefs: PortalFieldDef[] }) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<SocialPost>) {
    startTransition(async () => { await updateSocialPost(post.id, clientId, patch); });
  }

  function togglePlataforma(p: string) {
    const cur = post.plataforma ?? [];
    save({ plataforma: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] });
  }
  function toggleTipo(t: string) {
    const cur = post.tipo_contenido ?? [];
    save({ tipo_contenido: cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t] });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={post.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={post.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as SocialPost['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Fecha" icon={<Calendar className="w-3.5 h-3.5" />}>
        <InlineCell value={post.fecha_publicacion ?? ''} type="date" canEdit={canEdit}
          onSave={(v) => save({ fecha_publicacion: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Plataformas" icon={<Globe className="w-3.5 h-3.5" />} vertical>
        <div className="flex flex-wrap gap-1.5">
          {PLATAFORMAS.map((p) => (
            <button key={p} type="button"
              onClick={() => canEdit && togglePlataforma(p)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                post.plataforma?.includes(p)
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                  : 'border-white/10 text-white/40 hover:border-white/30'
              } ${!canEdit ? 'cursor-default' : 'cursor-pointer'}`}>
              {p}
            </button>
          ))}
        </div>
      </PropertyRow>

      <PropertyRow label="Tipo" icon={<Tag className="w-3.5 h-3.5" />} vertical>
        <div className="flex flex-wrap gap-1.5">
          {TIPOS.map((t) => (
            <button key={t} type="button"
              onClick={() => canEdit && toggleTipo(t)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                post.tipo_contenido?.includes(t)
                  ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37]/80'
                  : 'border-white/10 text-white/40 hover:border-white/30'
              } ${!canEdit ? 'cursor-default' : 'cursor-pointer'}`}>
              {t}
            </button>
          ))}
        </div>
      </PropertyRow>

      <PropertyRow label="Público" icon={<Users className="w-3.5 h-3.5" />}>
        <InlineCell value={post.publico_objetivo ?? ''} canEdit={canEdit}
          onSave={(v) => save({ publico_objetivo: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Campaña" icon={<Tag className="w-3.5 h-3.5" />}>
        <RelationPicker
          value={post.campaign_id}
          options={campaigns.map((c) => ({ id: c.id, label: c.nombre, subtitle: c.estado }))}
          onSelect={(id) => save({ campaign_id: id })}
          canEdit={canEdit}
          placeholder="Vincular campaña..."
        />
      </PropertyRow>

      <PropertyRow label="URL publicación" icon={<ExternalLink className="w-3.5 h-3.5" />}>
        <div className="flex items-center gap-2">
          <InlineCell value={post.url_publicacion ?? ''} canEdit={canEdit}
            onSave={(v) => save({ url_publicacion: v || null })} placeholder="—" />
          {/^https?:\/\//i.test(post.url_publicacion ?? '') && (
            <a href={post.url_publicacion!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37] flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
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
              value={(post.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(post.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="social_post" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar publicación
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function PostTable({ posts, clientId, canEdit, onOpen }: {
  posts: SocialPost[]; clientId: string; canEdit: boolean; onOpen: (p: SocialPost) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <Globe className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin publicaciones en redes</p>
        <p className="text-white/20 text-xs">Crea la primera con "Nueva publicación"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_120px_1fr_90px] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Estado', 'Plataformas', 'Fecha'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {posts.map((p, idx) => (
        <div key={p.id}
          className={`grid grid-cols-[2fr_120px_1fr_90px] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== posts.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(p)}>
          <div className="px-3 py-2.5 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{p.nombre}</span>
            {p.tipo_contenido && p.tipo_contenido.length > 0 && (
              <span className="text-[11px] text-[#D4AF37]/50 truncate block">{p.tipo_contenido.join(', ')}</span>
            )}
          </div>
          <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={p.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateSocialPost(p.id, clientId, { estado: v as SocialPost['estado'] }); }} />
          </div>
          <div className="px-3 py-2 min-w-0">
            {p.plataforma && p.plataforma.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {p.plataforma.slice(0, 2).map((pl) => (
                  <span key={pl} className="text-[10px] text-white/50 border border-white/10 rounded-full px-1.5 py-0.5">{pl}</span>
                ))}
                {p.plataforma.length > 2 && (
                  <span className="text-[10px] text-white/30">+{p.plataforma.length - 2}</span>
                )}
              </div>
            ) : <span className="text-xs text-white/30">—</span>}
          </div>
          <div className="px-3 py-2 text-xs text-white/40">
            {p.fecha_publicacion ? new Date(p.fecha_publicacion).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create form ───────────────────────────────────────────────────────────────
function NewPostForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState<SocialPost['estado']>('Idea');
  const [fecha, setFecha] = useState('');
  const [plataforma, setPlataforma] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createSocialPost(clientId, {
        nombre: nombre.trim(), estado, fecha_publicacion: fecha || null,
        plataforma: plataforma.length ? plataforma : null,
        tipo_contenido: null, publico_objetivo: null,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nueva publicación</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <select value={estado} onChange={(e) => setEstado(e.target.value as SocialPost['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none" />
      </div>
      <div>
        <p className="text-[11px] text-white/40 mb-1.5">Plataformas</p>
        <div className="flex flex-wrap gap-1.5">
          {PLATAFORMAS.map((p) => (
            <button key={p} type="button"
              onClick={() => setPlataforma((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${plataforma.includes(p) ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Crear publicación'}
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
export function SocialTab({ posts: initialPosts, clientId, canEdit, campaigns, fieldDefs }: {
  posts: SocialPost[]; clientId: string; canEdit: boolean; campaigns: Campaign[]; fieldDefs: PortalFieldDef[];
}) {
  const posts = useRealtimeTable<SocialPost>('portal_social_posts', clientId, initialPosts);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<SocialPost | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? posts.find((p) => p.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? posts.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const STATUS_COL_COLORS: Record<string, string> = {
    Idea: 'border-gray-500', 'En producción': 'border-yellow-500',
    Programado: 'border-blue-500', Publicado: 'border-green-500', Cancelado: 'border-red-500',
  };

  const kanbanColumns = ESTADOS.map((estado) => ({
    id: estado,
    label: estado,
    color: STATUS_COL_COLORS[estado] ?? 'border-white/20',
    items: posts.filter((p) => p.estado === estado).map((p) => ({
      id: p.id,
      title: p.nombre,
      subtitle: p.plataforma?.join(', ') ?? undefined,
      badge: p.tipo_contenido?.[0] ?? undefined,
      badgeColor: 'bg-white/8 text-white/50',
      meta: [
        p.tipo_contenido?.join(', ') ?? '',
        p.fecha_publicacion ? new Date(p.fecha_publicacion).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : '',
      ].filter(Boolean),
    })),
  }));

  async function handleMoveItem(itemId: string, newColumnId: string) {
    await updateSocialPost(itemId, clientId, { estado: newColumnId as SocialPost['estado'] });
  }

  const calendarEvents = posts
    .filter((p) => p.fecha_publicacion)
    .map((p) => ({
      id: p.id, title: p.nombre, date: p.fecha_publicacion!.slice(0, 10),
      color: ESTADO_COLORS[p.estado] ?? '#D4AF37',
      onClick: () => setSelected(p),
    }));

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteSocialPost(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active={view} onChange={setView} />
          <span className="text-xs text-white/30">{posts.length} publicación{posts.length !== 1 ? 'es' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar publicación..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva publicación
          </button>
        )}
      </div>

      {showForm && <NewPostForm clientId={clientId} onClose={() => setShowForm(false)} />}

      {view === 'table' && <PostTable posts={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />}
      {view === 'board' && (
        <KanbanBoard columns={kanbanColumns} onMoveItem={handleMoveItem} canEdit={canEdit}
          onCardClick={(id) => { const p = posts.find((x) => x.id === id); if (p) setSelected(p); }} />
      )}
      {view === 'calendar' && <CalendarGrid events={calendarEvents} />}

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.estado}${selectedLive.plataforma?.length ? ' · ' + selectedLive.plataforma.join(', ') : ''}` : ''}>
        {selectedLive && (
          <PostDetail post={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} campaigns={campaigns} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
