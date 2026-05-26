import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MensajesPage() {
  await requireAuth();
  const supabase = createSupabaseServiceRole();
  const { data } = await supabase
    .from("ac_contacts")
    .select("id, email, nombre, asunto, mensaje, leido_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Contacto</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Mensajes recibidos
        </h1>
        <p className="mt-2 text-sm text-white/55">{rows.length} mensajes totales</p>
      </header>

      <div className="space-y-3">
        {rows.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border p-5 transition-colors ${
              m.leido_at
                ? "border-[color:var(--line)] bg-[color:var(--surface-1)]/60"
                : "border-[color:var(--gold-mid)]/30 bg-[color:var(--surface-1)]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-white">{m.nombre}</p>
                <p className="text-xs text-white/55">{m.email}</p>
              </div>
              <span className="text-[11px] text-white/40">
                {new Date(m.created_at).toLocaleString("es-CO")}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-white/80 leading-relaxed">
              {m.mensaje}
            </p>
          </article>
        ))}
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[color:var(--line)] p-10 text-center text-sm text-white/40">
            Sin mensajes aún.
          </p>
        ) : null}
      </div>
    </div>
  );
}
