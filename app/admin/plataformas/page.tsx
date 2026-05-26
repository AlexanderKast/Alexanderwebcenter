import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { plataformas } from "@/content/marca/plataformas";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PlataformasPage() {
  await requireAuth();
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Plataformas</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Setup por canal
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Bio, frecuencia, hashtags, KPIs y horarios sugeridos de cada red.
        </p>
      </header>

      <div className="space-y-5">
        {plataformas.map((p) => (
          <article key={p.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
                  {p.nombre}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                  {p.handle}
                </h3>
                <p className="mt-1 text-xs text-white/45">
                  {p.frecuencia}
                  {p.duracionIdeal ? ` · ${p.duracionIdeal}` : ""}
                </p>
              </div>
              {p.url ? (
                <Link
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line)] px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-[color:var(--gold-mid)]/40 hover:text-white"
                >
                  Abrir <ExternalLink className="size-3" />
                </Link>
              ) : null}
            </div>

            <div className="mt-5 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Bio</p>
              <p className="mt-1 text-sm text-white/85 leading-relaxed">{p.bio}</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Formato dominante
                </p>
                <p className="mt-1 text-sm text-white/80">{p.formatoDominante}</p>
                {p.pilaresFoco ? (
                  <p className="mt-3 text-xs text-white/55">{p.pilaresFoco}</p>
                ) : null}
              </div>
              <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  KPIs 90 días
                </p>
                <ul className="mt-1 space-y-0.5 text-xs text-white/75">
                  {Object.entries(p.kpis90Dias).map(([k, v]) => (
                    <li key={k}>
                      <span className="text-white/50">{k}:</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {p.hashtagsCore?.length ? (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Hashtags core
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.hashtagsCore.map((h) => (
                    <span key={h} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                      #{h}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {p.horariosSugeridos?.length ? (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Horarios
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.horariosSugeridos.map((h) => (
                    <span key={h} className="rounded-md border border-[color:var(--line)] bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {p.highlightsOPlaylists?.length ? (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                  Highlights / Playlists
                </p>
                <ul className="mt-2 space-y-1 text-xs text-white/70">
                  {p.highlightsOPlaylists.map((h) => (
                    <li key={h}>— {h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {p.notas ? (
              <p className="mt-4 rounded-md border border-[color:var(--gold-mid)]/20 bg-[color:var(--gold-mid)]/5 p-3 text-xs text-[color:var(--gold-light)]">
                Nota: {p.notas}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
