import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { CheckCircle2, UserX } from "lucide-react";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  founder: "Founder",
  manager: "Manager",
  coordinator: "Coordinador",
  sales: "Ventas",
  creative: "Creativo",
};

export default async function EquipoPage() {
  await requireAuth();
  const supabase = createSupabaseServiceRole();
  const { data } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, is_active, last_login_at, created_at")
    .order("created_at", { ascending: true });

  const rows = data ?? [];
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Equipo</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Miembros del admin
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Mismos <code className="text-[color:var(--gold-mid)]">admin_users</code> de UGC Colombia.
          Los permisos y el login son compartidos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5"
          >
            <div className="flex items-center justify-between">
              <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[color:var(--gold-dark)] to-[color:var(--gold-mid)] text-xs font-bold text-black">
                {(m.full_name ?? m.email).slice(0, 2).toUpperCase()}
              </div>
              {m.is_active ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                  <CheckCircle2 className="size-3.5" /> activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-white/40">
                  <UserX className="size-3.5" /> inactivo
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-base font-semibold text-white">
              {m.full_name ?? m.email}
            </p>
            <p className="mt-1 text-xs text-white/55">{m.email}</p>
            <p className="mt-4 inline-flex rounded-full border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/10 px-3 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[color:var(--gold-light)]">
              {ROLE_LABEL[m.role] ?? m.role}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
