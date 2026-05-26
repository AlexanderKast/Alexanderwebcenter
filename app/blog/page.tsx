import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listBlogPosts } from "@/lib/blog";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Insights",
  description:
    "Articulos sobre Dios, Estrategia e IA. Procesos reales de un emprendedor construyendo en publico.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();

  return (
    <section className="container-narrow py-24 md:py-32">
      <SectionHeading
        superlabel="Blog"
        title="Insights"
        description="La version larga de lo que comparto en newsletter. Sin relleno."
      />

      {posts.length === 0 ? (
        <p className="mt-10 text-white/60">Pronto publicare el primer articulo.</p>
      ) : (
        <ul className="mt-14 space-y-6">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-[color:var(--gold)]/40"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden>·</span>
                  <Badge
                    variant="outline"
                    className="border-[color:var(--gold)]/40 text-[color:var(--gold)]"
                  >
                    {post.pilar}
                  </Badge>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min</span>
                </div>
                <h2 className="mt-3 font-display text-2xl tracking-tight group-hover:text-[color:var(--gold)]">
                  {post.title}
                </h2>
                <p className="mt-2 text-white/70 text-pretty">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--gold)]">
                  Leer
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
