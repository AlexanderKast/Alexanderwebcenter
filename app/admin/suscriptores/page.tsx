import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuscriptoresPage() {
  await requireAuth();
  const supabase = createSupabaseServiceRole();
  const { data: subs } = await supabase
    .from("ac_subscribers")
    .select("id, email, source, pilar_interest, confirmed_at, unsubscribed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = subs ?? [];
  const activos = rows.filter((r) => !r.unsubscribed_at);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Newsletter</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Suscriptores
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {activos.length} activos de {rows.length} totales · Dios, Estrategia e IA
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)]">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="border-b border-[color:var(--line)] bg-[color:var(--surface-2)] text-[11px] uppercase tracking-[0.18em] text-white/50">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Fuente</th>
              <th className="px-4 py-3 text-left">Pilar</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Alta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line)]">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white">{r.email}</td>
                <td className="px-4 py-3 text-white/60">{r.source ?? "—"}</td>
                <td className="px-4 py-3 text-[color:var(--gold-mid)]">{r.pilar_interest ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.unsubscribed_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-300">
                      <XCircle className="size-3.5" /> baja
                    </span>
                  ) : r.confirmed_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                      <CheckCircle2 className="size-3.5" /> confirmado
                    </span>
                  ) : (
                    <span className="text-xs text-white/40">pendiente</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/50">
                  {new Date(r.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/40">
                  Todavía no hay suscriptores.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
