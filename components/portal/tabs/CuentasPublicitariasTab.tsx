'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, LayoutList, Tag, Globe, Hash, FileText } from 'lucide-react';
import { ViewSwitcher } from '@/components/portal/ViewSwitcher';
import { InlineCell } from '@/components/portal/InlineCell';
import { PageSheet } from '@/components/portal/PageSheet';
import { PropertyRow } from '@/components/portal/PropertyRow';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { createAdAccount, updateAdAccount, deleteAdAccount, deleteFieldDef } from '@/lib/portal/actions';
import { DynamicFieldRow } from '@/components/portal/DynamicFieldRow';
import { FieldDefManager } from '@/components/portal/FieldDefManager';
import type { AdAccount, Campaign, PortalFieldDef } from '@/lib/portal/types';

const PLATAFORMAS = ['Meta', 'Google Ads', 'TikTok Ads', 'LinkedIn Ads', 'Pinterest Ads', 'X Ads'];
const ESTADOS: AdAccount['estado'][] = ['Activa', 'Pausada', 'Suspendida', 'Cerrada'];

const VIEWS = [
  { id: 'table', label: 'Tabla', icon: <LayoutList className="w-3.5 h-3.5" /> },
];

const ESTADO_COLORS: Record<string, string> = {
  Activa: 'text-green-400', Pausada: 'text-yellow-400',
  Suspendida: 'text-red-400', Cerrada: 'text-white/30',
};

// ── Detail panel ──────────────────────────────────────────────────────────────
function AccountDetail({ acc, clientId, canEdit, onDelete, campaigns, fieldDefs }: { acc: AdAccount; clientId: string; canEdit: boolean; onDelete: () => void; campaigns: Campaign[]; fieldDefs: PortalFieldDef[] }) {
  const [isPending, startTransition] = useTransition();
  function save(patch: Partial<AdAccount>) {
    startTransition(async () => { await updateAdAccount(acc.id, clientId, patch); });
  }

  return (
    <div className="space-y-1">
      <div className="mb-6">
        <InlineCell
          value={acc.nombre}
          canEdit={canEdit}
          onSave={(v) => save({ nombre: v })}
          className="text-xl font-semibold text-white"
        />
      </div>

      <PropertyRow label="Estado" icon={<Tag className="w-3.5 h-3.5" />}>
        <InlineCell value={acc.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
          onSave={(v) => save({ estado: v as AdAccount['estado'] })} />
      </PropertyRow>

      <PropertyRow label="Plataforma" icon={<Globe className="w-3.5 h-3.5" />}>
        <InlineCell value={acc.plataforma ?? ''} type="select" options={PLATAFORMAS} canEdit={canEdit}
          onSave={(v) => save({ plataforma: v || null })} placeholder="—" />
      </PropertyRow>

      <PropertyRow label="Account ID" icon={<Hash className="w-3.5 h-3.5" />}>
        <InlineCell value={acc.account_id ?? ''} canEdit={canEdit}
          onSave={(v) => save({ account_id: v || null })} placeholder="ej. act_1234567890"
          className="font-mono text-[#D4AF37]/80" />
      </PropertyRow>

      <PropertyRow label="Notas" icon={<FileText className="w-3.5 h-3.5" />} vertical>
        {canEdit ? (
          <textarea
            defaultValue={acc.notas ?? ''}
            onBlur={(e) => save({ notas: e.target.value || null })}
            rows={3}
            placeholder="Notas sobre la cuenta..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-white/60">{acc.notas || '—'}</p>
        )}
      </PropertyRow>

      {(() => {
        const linked = campaigns.filter((c) => c.ad_account_id === acc.id);
        if (!linked.length) return null;
        return (
          <div className="pt-4 space-y-2">
            <p className="text-[11px] text-white/35 uppercase tracking-wider">Campañas vinculadas ({linked.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {linked.map((c) => (
                <span key={c.id} className="text-[11px] bg-white/[0.05] border border-white/10 rounded-md px-2 py-1 text-white/70">
                  {c.nombre}
                </span>
              ))}
            </div>
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
              value={(acc.custom_fields ?? {})[def.id]}
              canEdit={canEdit}
              onSave={(v) => save({ custom_fields: { ...(acc.custom_fields ?? {}), [def.id]: v } })}
              onDeleteDef={canEdit ? () => {
                if (confirm(`¿Eliminar el campo "${def.name}" de todos los registros?`)) {
                  startTransition(async () => { await deleteFieldDef(def.id, clientId); });
                }
              } : undefined}
            />
          ))}
          {canEdit && <FieldDefManager entityType="ad_account" clientId={clientId} fieldCount={fieldDefs.length} />}
        </div>
      )}

      {canEdit && (
        <div className="pt-6 border-t border-white/8 mt-4">
          <button onClick={onDelete} disabled={isPending}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar cuenta
          </button>
        </div>
      )}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function AccountTable({ accounts, clientId, canEdit, onOpen }: {
  accounts: AdAccount[]; clientId: string; canEdit: boolean; onOpen: (a: AdAccount) => void;
}) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-14 text-center space-y-2">
        <Globe className="w-8 h-8 text-white/15 mx-auto" />
        <p className="text-white/30 text-sm">Sin cuentas publicitarias</p>
        <p className="text-white/20 text-xs">Agrega la primera con "Nueva cuenta"</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[2fr_100px_100px_1fr] bg-white/[0.03] border-b border-white/8">
        {['Nombre', 'Plataforma', 'Estado', 'Account ID'].map((h) => (
          <div key={h} className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold">{h}</div>
        ))}
      </div>
      {accounts.map((acc, idx) => (
        <div key={acc.id}
          className={`grid grid-cols-[2fr_100px_100px_1fr] items-center hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx !== accounts.length - 1 ? 'border-b border-white/5' : ''}`}
          onClick={() => onOpen(acc)}>
          <div className="px-3 py-2.5 min-w-0">
            <span className="text-sm text-white/80 group-hover:text-white truncate block transition-colors">{acc.nombre}</span>
          </div>
          <div className="px-3 py-2 text-xs text-white/50 truncate">{acc.plataforma ?? '—'}</div>
          <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <InlineCell value={acc.estado} type="select" options={ESTADOS as string[]} canEdit={canEdit}
              onSave={async (v) => { await updateAdAccount(acc.id, clientId, { estado: v as AdAccount['estado'] }); }} />
          </div>
          <div className="px-3 py-2 text-[11px] font-mono text-[#D4AF37]/50 truncate">
            {acc.account_id ?? '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create form ───────────────────────────────────────────────────────────────
function NewAccountForm({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [accountId, setAccountId] = useState('');
  const [estado, setEstado] = useState<AdAccount['estado']>('Activa');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await createAdAccount(clientId, {
        nombre: nombre.trim(), plataforma: plataforma || null,
        account_id: accountId || null, estado, notas: null,
      });
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="border border-[#D4AF37]/25 rounded-xl p-4 space-y-3 bg-[#D4AF37]/5">
      <p className="text-sm font-semibold text-[#D4AF37]">Nueva cuenta publicitaria</p>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" autoFocus
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <select value={plataforma} onChange={(e) => setPlataforma(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          <option value="">Plataforma</option>
          {PLATAFORMAS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value as AdAccount['estado'])}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none">
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Account ID (ej. act_1234567890)"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none" />
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !nombre.trim()}
          className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E5C047] disabled:opacity-40 transition-colors">
          {isPending ? 'Creando...' : 'Agregar cuenta'}
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
export function CuentasPublicitariasTab({ accounts: initialAccounts, clientId, canEdit, campaigns, fieldDefs }: {
  accounts: AdAccount[]; clientId: string; canEdit: boolean; campaigns: Campaign[]; fieldDefs: PortalFieldDef[];
}) {
  const accounts = useRealtimeTable<AdAccount>('portal_ad_accounts', clientId, initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<AdAccount | null>(null);
  const [search, setSearch] = useState('');
  const selectedLive = selected ? accounts.find((a) => a.id === selected.id) ?? selected : null;

  const filtered = search.trim()
    ? accounts.filter((a) => a.nombre.toLowerCase().includes(search.toLowerCase()))
    : accounts;

  function handleDelete() {
    if (!selectedLive || !confirm(`¿Eliminar la cuenta "${selectedLive.nombre}"?`)) return;
    setSelected(null);
    deleteAdAccount(selectedLive.id, clientId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <ViewSwitcher views={VIEWS} active="table" onChange={() => {}} />
          <span className="text-xs text-white/30">{accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cuenta..."
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none w-40"
          />
        </div>
        {canEdit && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nueva cuenta
          </button>
        )}
      </div>

      {showForm && <NewAccountForm clientId={clientId} onClose={() => setShowForm(false)} />}

      <AccountTable accounts={filtered} clientId={clientId} canEdit={canEdit} onOpen={setSelected} />

      <PageSheet open={!!selectedLive} onClose={() => setSelected(null)}
        title={selectedLive?.nombre ?? ''}
        subtitle={selectedLive ? `${selectedLive.plataforma ?? 'Sin plataforma'} · ${selectedLive.estado}` : ''}>
        {selectedLive && (
          <AccountDetail acc={selectedLive} clientId={clientId} canEdit={canEdit} onDelete={handleDelete} campaigns={campaigns} fieldDefs={fieldDefs} />
        )}
      </PageSheet>
    </div>
  );
}
