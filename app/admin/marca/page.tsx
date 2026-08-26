import Image from "next/image";
import { requireAuth } from "@/lib/auth";
import {
  brandIdentity,
  brandColors,
  brandTypography,
  brandVoice,
  brandPromise,
  brandLogos,
} from "@/content/marca/brand";

export const dynamic = "force-dynamic";

export default async function MarcaPage() {
  await requireAuth();

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Manual de marca</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Identidad visual y verbal
        </h1>
        <p className="mt-2 text-sm text-white/55">
          La guía viva de cómo se ve, suena y se expresa Alexander Cast.
        </p>
      </header>

      {/* Identidad */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Identidad</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-white">{brandIdentity.nombre}</h2>
            <p className="mt-2 text-lg text-gold-metallic">{brandIdentity.tagline}</p>
            <p className="mt-4 text-sm text-white/65">
              {brandIdentity.handle} · {brandIdentity.ubicacion}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brandIdentity.arquetipo.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-[color:var(--gold-mid)]/30 bg-[color:var(--gold-mid)]/10 px-3 py-1 text-xs text-[color:var(--gold-light)]"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Personalidad</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/80">
              {brandIdentity.personalidad.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-[color:var(--gold-mid)]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote className="mt-8 border-l-2 border-[color:var(--gold-mid)]/60 pl-4 text-base italic text-white/80">
          {brandPromise}
        </blockquote>
      </section>

      {/* Logos */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Logos</p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {brandLogos.map((l) => (
            <div key={l.archivo} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-5">
              <div className="relative flex h-32 items-center justify-center rounded-lg bg-black">
                <Image
                  src={l.archivo}
                  alt={l.nombre}
                  width={300}
                  height={160}
                  className="max-h-24 w-auto"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{l.nombre}</p>
              <p className="text-xs text-white/50">{l.uso}</p>
              <code className="mt-2 block rounded bg-black/40 px-2 py-1 text-[11px] text-[color:var(--gold-mid)]">
                {l.archivo}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Paleta */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Paleta de colores</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {brandColors.map((c) => (
            <div
              key={c.hex}
              className="flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3"
            >
              <div
                className="size-12 shrink-0 rounded-lg border border-white/10"
                style={{ backgroundColor: c.hex }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs text-white/50">{c.role}</p>
                <code className="text-[11px] text-[color:var(--gold-mid)]">{c.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tipografía */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Tipografía</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <p className="font-display text-4xl text-white">{brandTypography.display.familia}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">Display</p>
            <p className="mt-1 text-sm text-white/60">{brandTypography.display.uso}</p>
            <p className="mt-2 text-xs text-white/40">
              Pesos: {brandTypography.display.pesos.join(" · ")}
            </p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-white">{brandTypography.body.familia}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">Body</p>
            <p className="mt-1 text-sm text-white/60">{brandTypography.body.uso}</p>
            <p className="mt-2 text-xs text-white/40">
              Pesos: {brandTypography.body.pesos.join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-[color:var(--line)]">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-[color:var(--surface-2)] text-left text-[11px] uppercase tracking-[0.15em] text-white/50">
              <tr>
                <th className="px-4 py-2">Clase</th>
                <th className="px-4 py-2">Tamaño</th>
                <th className="px-4 py-2">Peso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--line)]">
              {brandTypography.escalas.map((e) => (
                <tr key={e.clase}>
                  <td className="px-4 py-2 font-mono text-[color:var(--gold-mid)]">{e.clase}</td>
                  <td className="px-4 py-2 text-white/80">{e.tamano}</td>
                  <td className="px-4 py-2 text-white/60">{e.peso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Voz */}
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6 md:p-8">
        <p className="eyebrow">Voz y tono</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-white/80">{brandVoice.personas}</p>
            <p className="mt-2 text-sm text-white/60">{brandVoice.conjugacion}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">
              Cualidades
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {brandVoice.cualidades.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[color:var(--gold-mid)]/20 bg-[color:var(--gold-mid)]/5 px-2.5 py-0.5 text-xs text-[color:var(--gold-light)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-400/80">Evitar</p>
            <ul className="mt-2 space-y-1.5 text-sm text-white/70">
              {brandVoice.evitar.map((e) => (
                <li key={e} className="flex gap-2">
                  <span className="text-red-400">×</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold-mid)]">Hooks modelo</p>
          <ul className="mt-3 space-y-2">
            {brandVoice.hooks_modelo.map((h) => (
              <li
                key={h}
                className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 text-sm italic text-white/85"
              >
                &ldquo;{h}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
