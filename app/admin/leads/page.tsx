import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { LeadsKanban } from "./LeadsKanban";

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

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireAuth();
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("ac_leads")
    .select("id, email, nombre, lead_magnet_slug, stage, temperature, notes, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
        Error al leer ac_leads: {error.message}
      </div>
    );
  }

  const leads = (data ?? []) as Lead[];

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">CRM</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Pipeline de leads
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {leads.length} leads desde las descargas del sitio. Arrastra entre columnas para cambiar estado.
        </p>
      </header>

      <LeadsKanban initial={leads} />
    </div>
  );
}
