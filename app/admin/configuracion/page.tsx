import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const user = await requireAuth();
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Configuración</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Ajustes
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <p className="eyebrow">Tu sesión</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-white/50">Email</dt><dd className="text-white">{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-white/50">Nombre</dt><dd className="text-white">{user.fullName ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-white/50">Rol</dt><dd className="text-[color:var(--gold-mid)]">{user.role}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <p className="eyebrow">Integraciones</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-white/75">Supabase</span>
              <code className="text-xs text-[color:var(--gold-mid)]">domxgsrajwyuaffiqbtr</code>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/75">Resend</span>
              <span className="text-xs text-white/40">{process.env.RESEND_API_KEY ? "OK" : "falta key"}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/75">Upstash</span>
              <span className="text-xs text-white/40">{process.env.UPSTASH_REDIS_REST_URL ? "OK" : "desactivado"}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/75">Apify</span>
              <span className="text-xs text-white/40">{process.env.APIFY_TOKEN ? "OK" : "pendiente"}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
