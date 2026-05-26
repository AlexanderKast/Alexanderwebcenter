import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  nuevo: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  contactado: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  agendado: "border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/10 text-[color:var(--gold-light)]",
  cerrado: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  descartado: "border-zinc-500/30 bg-white/5 text-white/40",
};

export default async function ConsultoriasPage() {
  await requireAuth();
  const supabase = createSupabaseServiceRole();
  const { data } = await supabase
    .from("ac_consultations")
    .select("id, email, nombre, empresa, mensaje, tipo_servicio, status, scheduled_for, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Consultorías</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Solicitudes de llamada
        </h1>
        <p className="mt-2 text-sm text-white/55">{rows.length} solicitudes totales</p>
      </header>

      <div className="space-y-3">
        {rows.map((r) => (
          <article
            key={r.id}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5 transition-colors hover:border-[color:var(--gold-mid)]/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-white">{r.nombre}</p>
                <p className="text-xs text-white/55">{r.email}{r.empresa ? ` · ${r.empresa}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.tipo_servicio ? (
                  <span className="rounded-full border border-[color:var(--line)] bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white/70">
                    {r.tipo_servicio}
                  </span>
                ) : null}
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${STATUS_TONE[r.status] ?? STATUS_TONE.nuevo}`}
                >
                  {r.status}
                </span>
              </div>
            </div>
            {r.mensaje ? (
              <p className="mt-3 text-sm text-white/75 leading-relaxed">{r.mensaje}</p>
            ) : null}
            <p className="mt-3 text-[11px] text-white/40">
              {new Date(r.created_at).toLocaleString("es-CO")}
            </p>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[color:var(--line)] p-10 text-center text-sm text-white/40">
            Todavía no hay solicitudes.
          </p>
        ) : null}
      </div>
    </div>
  );
}
