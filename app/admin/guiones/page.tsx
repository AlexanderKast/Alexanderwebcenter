import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { FileText, Video, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const pilaresYouTube = [
  { slug: "dios", nombre: "Dios", total: 10, archivo: "02-YouTube/50-Videos-P1-Dios.md" },
  { slug: "estrategia", nombre: "Estrategia", total: 10, archivo: "02-YouTube/50-Videos-P2-Estrategia.md" },
  { slug: "ia", nombre: "IA", total: 10, archivo: "02-YouTube/50-Videos-P3-IA.md" },
  { slug: "proceso", nombre: "Proceso", total: 10, archivo: "02-YouTube/50-Videos-P4-Proceso.md" },
  { slug: "vida-real", nombre: "Vida Real", total: 10, archivo: "02-YouTube/50-Videos-P5-Vida.md" },
];

const pilaresReels = [
  { slug: "dios", nombre: "Dios", total: 50, archivo: "03-Reels-TikTok-Shorts/Reels-Pilar-1-Dios-50.md" },
  { slug: "estrategia", nombre: "Estrategia", total: 50, archivo: "03-Reels-TikTok-Shorts/Reels-Pilar-2-Estrategia-50.md" },
  { slug: "ia", nombre: "IA", total: 50, archivo: "03-Reels-TikTok-Shorts/Reels-Pilar-3-IA-50.md" },
  { slug: "proceso", nombre: "Proceso", total: 50, archivo: "03-Reels-TikTok-Shorts/Reels-Pilar-4-Proceso-50.md" },
  { slug: "vida-real", nombre: "Vida Real", total: 50, archivo: "03-Reels-TikTok-Shorts/Reels-Pilar-5-Vida-50.md" },
];

export default async function GuionesPage() {
  await requireAuth();
  const totalYT = pilaresYouTube.reduce((s, p) => s + p.total, 0);
  const totalReels = pilaresReels.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Biblioteca de guiones</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          {totalYT} YouTube + {totalReels} Reels
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Guiones fuente en{" "}
          <code className="text-[color:var(--gold-mid)]">H:/Mi unidad/Marca-Personal-Alexander-Cast/</code>.
          Esta vista es un índice operativo.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Video className="size-4 text-[color:var(--gold-mid)]" />
          <h2 className="eyebrow m-0">YouTube (long-form 10-20 min)</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {pilaresYouTube.map((p) => (
            <article key={p.slug} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                {p.nombre}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-white">{p.total}</p>
              <p className="text-xs text-white/50">guiones listos</p>
              <code className="mt-3 block break-all rounded bg-black/40 px-2 py-1 text-[10px] text-white/60">
                {p.archivo}
              </code>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="size-4 text-[color:var(--gold-mid)]" />
          <h2 className="eyebrow m-0">Reels / TikTok / Shorts (30-60s)</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {pilaresReels.map((p) => (
            <article key={p.slug} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
                {p.nombre}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-white">{p.total}</p>
              <p className="text-xs text-white/50">ideas de reels</p>
              <code className="mt-3 block break-all rounded bg-black/40 px-2 py-1 text-[10px] text-white/60">
                {p.archivo}
              </code>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <p className="eyebrow">Cómo extraerlos al admin</p>
        <p className="mt-3 text-sm text-white/65 leading-relaxed">
          Los guiones viven como Markdown en tu Drive. El siguiente paso es migrar cada archivo a la tabla{" "}
          <code className="text-[color:var(--gold-mid)]">content_scripts</code> de Supabase (ya existe en UGC Colombia)
          para tenerlos editables desde aquí con estados (idea → borrador → listo → publicado).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/contenido" className="btn-gold-outline h-10 text-xs">
            Ver blog MDX actual
          </Link>
          <Link href="/admin/contenido-plan" className="btn-gold-outline h-10 text-xs">
            Ver plan de contenido
          </Link>
          <a
            href="https://drive.google.com/drive/"
            target="_blank"
            rel="noreferrer"
            className="btn-gold-outline inline-flex h-10 items-center gap-1.5 text-xs"
          >
            Abrir Drive <ExternalLink className="size-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
