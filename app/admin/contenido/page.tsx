import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { listBlogPosts } from "@/lib/blog";
import { ExternalLink, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  await requireAuth();
  const posts = await listBlogPosts();

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Contenido</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
          Blog & recursos
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {posts.length} artículos publicados · fuente: <code>content/blog/*.mdx</code>
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)]">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="border-b border-[color:var(--line)] bg-[color:var(--surface-2)] text-[11px] uppercase tracking-[0.18em] text-white/50">
            <tr>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Pilar</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Lectura</th>
              <th className="px-4 py-3 text-right">Abrir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line)]">
            {posts.map((p) => (
              <tr key={p.slug} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="size-3.5 text-[color:var(--gold-mid)]" aria-hidden />
                    {p.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-[color:var(--gold-mid)]">{p.pilar}</td>
                <td className="px-4 py-3 text-white/60">
                  {new Date(p.date).toLocaleDateString("es-CO")}
                </td>
                <td className="px-4 py-3 text-white/60">{p.readingMinutes} min</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs text-[color:var(--gold-mid)] hover:text-[color:var(--gold-light)]"
                  >
                    Ver <ExternalLink className="size-3" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/40">
                  Sin artículos todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
