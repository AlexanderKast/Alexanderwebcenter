import Link from "next/link";
import {
  Users,
  Mail,
  CalendarCheck,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

async function getMetrics() {
  const supabase = createSupabaseServiceRole();
  const [subs, leads, consults, contacts] = await Promise.all([
    supabase.from("ac_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("ac_leads").select("id", { count: "exact", head: true }),
    supabase.from("ac_consultations").select("id", { count: "exact", head: true }),
    supabase.from("ac_contacts").select("id", { count: "exact", head: true }),
  ]);
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const [subs7, leads7, consults7, contacts7] = await Promise.all([
    supabase
      .from("ac_subscribers")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since.toISOString()),
    supabase
      .from("ac_leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since.toISOString()),
    supabase
      .from("ac_consultations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since.toISOString()),
    supabase
      .from("ac_contacts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since.toISOString()),
  ]);
  return {
    subscribers: { total: subs.count ?? 0, last7: subs7.count ?? 0 },
    leads: { total: leads.count ?? 0, last7: leads7.count ?? 0 },
    consultations: { total: consults.count ?? 0, last7: consults7.count ?? 0 },
    contacts: { total: contacts.count ?? 0, last7: contacts7.count ?? 0 },
  };
}

export default async function AdminDashboard() {
  const user = await requireAuth();
  const metrics = await getMetrics();

  const cards = [
    {
      label: "Suscriptores",
      href: "/admin/suscriptores",
      icon: Mail,
      total: metrics.subscribers.total,
      last7: metrics.subscribers.last7,
    },
    {
      label: "Leads (descargas)",
      href: "/admin/leads",
      icon: Users,
      total: metrics.leads.total,
      last7: metrics.leads.last7,
    },
    {
      label: "Consultorías",
      href: "/admin/consultorias",
      icon: CalendarCheck,
      total: metrics.consultations.total,
      last7: metrics.consultations.last7,
    },
    {
      label: "Mensajes",
      href: "/admin/mensajes",
      icon: MessageSquare,
      total: metrics.contacts.total,
      last7: metrics.contacts.last7,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Panel</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Hola, {user.fullName?.split(" ")[0] ?? "admin"}.
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Resumen del sitio público de Alexander Cast.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5 transition-colors hover:border-[color:var(--gold-mid)]/40"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[color:var(--gold-mid)]/10 text-[color:var(--gold-mid)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <ArrowUpRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--gold-mid)]" aria-hidden />
              </div>
              <p className="mt-6 font-display text-3xl font-bold text-white">
                {c.total.toLocaleString("es-CO")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">
                {c.label}
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-[color:var(--gold-light)]">
                <TrendingUp className="size-3" aria-hidden />
                +{c.last7} últimos 7 días
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <p className="eyebrow">Acciones rápidas</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/admin/leads" className="flex items-center justify-between rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">
                Ver pipeline de leads <ArrowUpRight className="size-3.5" />
              </Link>
            </li>
            <li>
              <Link href="/admin/consultorias" className="flex items-center justify-between rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">
                Solicitudes de consultoría nuevas <ArrowUpRight className="size-3.5" />
              </Link>
            </li>
            <li>
              <Link href="/admin/actividad" className="flex items-center justify-between rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">
                Ver actividad reciente <ArrowUpRight className="size-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <p className="eyebrow">DB compartida</p>
          <p className="mt-3 text-sm text-white/70">
            Este admin consume las tablas <code className="text-[color:var(--gold-mid)]">ac_*</code>{" "}
            del proyecto Supabase que compartes con UGC Colombia. Tu sesión y tus permisos son los mismos.
          </p>
          <p className="mt-3 text-xs text-white/40">
            Proyecto: <code>domxgsrajwyuaffiqbtr</code> · Rol: <code>{user.role}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
