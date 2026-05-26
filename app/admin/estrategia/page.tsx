import { requireAuth } from "@/lib/auth";
import { audiencia } from "@/content/marca/audiencia";
import { nivelesMonetizacion, metasIngresos } from "@/content/marca/monetizacion";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const DISPONIBLE_TONE: Record<string, string> = {
  activo: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  validando: "border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/10 text-[color:var(--gold-light)]",
  planeado: "border-white/10 bg-white/5 text-white/50",
};

export default async function EstrategiaPage() {
  await requireAuth();
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Estrategia</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Canvas de negocio
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Audiencia objetivo, escalera de valor y metas de ingresos.
        </p>
      </header>

      {/* Audiencia */}
      <section>
        <h2 className="eyebrow mb-4">Audiencia</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(audiencia).slice(0, 3).map(([key, a]) => (
            "dolor" in a ? (
              <article
                key={key}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                  {key}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {a.nombre}
                </h3>
                <p className="mt-1 text-xs text-white/55">
                  {a.rango} · {a.region}
                </p>
                <p className="mt-2 text-xs text-white/40">{a.negocio}</p>
                <div className="mt-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-red-400/80">Dolor</p>
                  <ul className="mt-2 space-y-1 text-xs text-white/75">
                    {a.dolor.map((d) => (
                      <li key={d}>— {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                    Deseo
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-white/75">
                    {a.deseo.map((d) => (
                      <li key={d}>✓ {d}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ) : null
          ))}
        </div>
        <article className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
            Afinidad
          </p>
          <h4 className="mt-2 font-display text-base font-semibold text-white">
            {audiencia.afinidad.nombre}
          </h4>
          <p className="mt-1 text-sm text-white/65">{audiencia.afinidad.descripcion}</p>
        </article>
      </section>

      {/* Escalera */}
      <section>
        <h2 className="eyebrow mb-4">Escalera de valor</h2>
        <div className="space-y-4">
          {nivelesMonetizacion.map((n) => (
            <article
              key={n.nivel}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                    Nivel {n.nivel} · {n.rangoPrecio}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">
                    {n.nombre}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">{n.objetivo}</p>
                </div>
                {n.metaMensual ? (
                  <span className="rounded-full border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/10 px-3 py-1 text-[11px] text-[color:var(--gold-light)]">
                    Meta: {n.metaMensual}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {n.productos.map((p) => (
                  <div
                    key={p.nombre}
                    className="flex items-start justify-between gap-3 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{p.nombre}</p>
                      <p className="mt-0.5 text-xs text-white/50">{p.descripcion}</p>
                      <p className="mt-1 text-xs font-semibold text-[color:var(--gold-mid)]">
                        {p.precio}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${DISPONIBLE_TONE[p.disponible]}`}
                    >
                      {p.disponible}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Metas */}
      <section className="rounded-2xl border border-[color:var(--gold-mid)]/30 bg-gradient-to-br from-[color:var(--gold-mid)]/5 to-transparent p-6 md:p-8">
        <p className="eyebrow">Proyección de ingresos</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {Object.entries(metasIngresos).map(([periodo, meta]) => (
            <div key={periodo} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-1)]/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                {periodo.replace(/mes/, "Mes ")}
              </p>
              <p className="mt-2 text-sm text-white/80">{meta}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 inline-flex items-center gap-2 text-xs text-white/50">
          <CheckCircle2 className="size-3.5 text-[color:var(--gold-mid)]" />
          Metas conservadoras. Escala depende de volumen de contenido + conversión BOFU.
        </p>
      </section>
    </div>
  );
}
