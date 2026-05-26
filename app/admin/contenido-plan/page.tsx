import { requireAuth } from "@/lib/auth";
import { pilaresPlan, sistemaProduccion, formatosGanadores } from "@/content/marca/pilares-plan";

export const dynamic = "force-dynamic";

export default async function ContenidoPlanPage() {
  await requireAuth();
  const totalPct = pilaresPlan.reduce((sum, p) => sum + p.porcentaje, 0);

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Plan de contenido</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          5 pilares · Distribución {totalPct}%
        </h1>
        <p className="mt-2 text-sm text-white/55">
          La estructura semanal de qué publicas, dónde y cómo.
        </p>
      </header>

      {/* Barra distribución */}
      <div className="overflow-hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-1)]">
        <div className="flex h-6">
          {pilaresPlan.map((p, i) => {
            const colors = ["#6B5B95", "#d4af37", "#8a6e18", "#3A7D44", "#B85C38"];
            return (
              <div
                key={p.slug}
                style={{ width: `${p.porcentaje}%`, backgroundColor: colors[i % 5] }}
                title={`${p.nombre} ${p.porcentaje}%`}
                className="flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.1em] text-black/80"
              >
                {p.porcentaje}%
              </div>
            );
          })}
        </div>
      </div>

      {/* Pilares */}
      <div className="space-y-5">
        {pilaresPlan.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                  Pilar {p.numero} · {p.porcentaje}%
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                  {p.nombre}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/75">{p.descripcion}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Formatos
                </p>
                <ul className="mt-2 space-y-1 text-xs text-white/70">
                  {p.formatos.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Plataformas ideales
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.plataformasIdeales.map((pl) => (
                    <span
                      key={pl}
                      className="rounded-full border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/5 px-2.5 py-0.5 text-[11px] text-[color:var(--gold-light)]"
                    >
                      {pl}
                    </span>
                  ))}
                </div>
                {p.plataformasEvitar.length ? (
                  <p className="mt-3 text-[11px] text-red-400/80">
                    Evitar: {p.plataformasEvitar.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Hook ejemplo</p>
                <p className="mt-1 text-sm italic text-white/85">&ldquo;{p.hookEjemplo}&rdquo;</p>
              </div>
              <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">CTA modelo</p>
                <p className="mt-1 text-sm text-white/75">{p.ctaModelo}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Sistema producción */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Sistema de producción semanal</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {sistemaProduccion.bloques.map((b, i) => (
            <div key={b.nombre} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                Bloque {i + 1}
              </p>
              <h4 className="mt-1 font-display text-base font-semibold text-white">{b.nombre}</h4>
              <p className="text-xs text-white/50">{b.duracion} · {b.dia}</p>
              <p className="mt-2 text-xs text-white/70">{b.output}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">Stack de IA</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(sistemaProduccion.stackIa).map(([tarea, herramienta]) => (
              <div key={tarea} className="flex justify-between rounded-md border border-[color:var(--line)] bg-[color:var(--surface-2)] px-3 py-2 text-xs">
                <span className="text-white/55">{tarea}</span>
                <span className="font-semibold text-[color:var(--gold-mid)]">{herramienta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formatos ganadores */}
      <section>
        <p className="eyebrow">10 formatos ganadores</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {formatosGanadores.map((f, i) => (
            <article
              key={f.nombre}
              className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-4"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-display text-sm font-semibold text-white">
                  <span className="text-[color:var(--gold-mid)]">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {f.nombre}
                </h4>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                  {f.plataformas}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/65">{f.estructura}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
