"use client";

import { useState, useTransition } from "react";
import { Flame, Snowflake, Sun, Mail, Download } from "lucide-react";
import { updateLeadStage } from "./actions";

type Lead = {
  id: string;
  email: string;
  nombre: string | null;
  lead_magnet_slug: string;
  stage: string;
  temperature: string;
  notes: string | null;
  source: string | null;
  created_at: string;
};

const STAGES: { value: string; label: string; tone: string }[] = [
  { value: "nuevo", label: "Nuevos", tone: "border-blue-500/30 bg-blue-500/5" },
  { value: "contactado", label: "Contactados", tone: "border-yellow-500/30 bg-yellow-500/5" },
  { value: "nutriendo", label: "Nutriendo", tone: "border-purple-500/30 bg-purple-500/5" },
  { value: "calificado", label: "Calificados", tone: "border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/5" },
  { value: "convertido", label: "Convertidos", tone: "border-emerald-500/30 bg-emerald-500/5" },
  { value: "descartado", label: "Descartados", tone: "border-zinc-500/20 bg-white/[0.02]" },
];

function TempIcon({ temp }: { temp: string }) {
  if (temp === "hot") return <Flame className="size-3.5 text-red-400" aria-label="Hot" />;
  if (temp === "cold") return <Snowflake className="size-3.5 text-blue-400" aria-label="Cold" />;
  return <Sun className="size-3.5 text-[color:var(--gold-mid)]" aria-label="Warm" />;
}

export function LeadsKanban({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [dragging, setDragging] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const byStage = STAGES.reduce<Record<string, Lead[]>>((acc, s) => {
    acc[s.value] = leads.filter((l) => l.stage === s.value);
    return acc;
  }, {});

  function onDragStart(id: string) {
    setDragging(id);
  }

  function onDrop(stage: string) {
    if (!dragging) return;
    const id = dragging;
    setDragging(null);
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    startTransition(async () => {
      const res = await updateLeadStage({ id, stage });
      if (!res.ok) {
        // Revert on error
        setLeads(initial);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {STAGES.map((s) => (
        <div
          key={s.value}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(s.value)}
          className={`rounded-2xl border ${s.tone} p-4 transition-colors`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {s.label}
            </h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
              {byStage[s.value]?.length ?? 0}
            </span>
          </div>
          <div className="space-y-2">
            {(byStage[s.value] ?? []).map((lead) => (
              <article
                key={lead.id}
                draggable
                onDragStart={() => onDragStart(lead.id)}
                className="cursor-grab rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-3 text-left transition-colors hover:border-[color:var(--gold-mid)]/40 active:cursor-grabbing"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {lead.nombre ?? lead.email.split("@")[0]}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-white/50">
                      <Mail className="size-2.5 shrink-0" aria-hidden />
                      {lead.email}
                    </p>
                  </div>
                  <TempIcon temp={lead.temperature} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.12em]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-white/70">
                    <Download className="size-2.5" aria-hidden />
                    {lead.lead_magnet_slug.slice(0, 20)}
                  </span>
                  <span className="text-white/30">
                    {new Date(lead.created_at).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </article>
            ))}
            {(byStage[s.value]?.length ?? 0) === 0 ? (
              <p className="rounded-lg border border-dashed border-[color:var(--line)] p-4 text-center text-[11px] text-white/30">
                Vacío
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
