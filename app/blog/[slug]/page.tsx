import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { listBlogPosts, getBlogPost } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="container-narrow py-24 md:py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" /> Volver al blog
      </Link>

      <header className="mt-10 space-y-4">
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
        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-balance">
          {post.title}
        </h1>
        <p className="text-lg text-white/70 text-pretty">{post.excerpt}</p>
      </header>

      <div className="prose prose-invert mt-12 max-w-none prose-headings:font-display prose-a:text-[color:var(--gold)]">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  { behavior: "wrap", properties: { className: ["no-underline"] } },
                ],
                [
                  rehypePrettyCode,
                  { theme: "github-dark-dimmed", keepBackground: false },
                ],
              ],
            },
          }}
        />
      </div>
    </article>
  );
}
