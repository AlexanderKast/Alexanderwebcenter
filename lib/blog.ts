import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  pilar: "dios" | "estrategia" | "ia" | "proceso" | "vida-real";
  excerpt: string;
  cover?: string;
  tags?: string[];
};

export type BlogPost = BlogFrontmatter & {
  content: string;
  readingMinutes: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export async function listBlogPosts(): Promise<BlogPost[]> {
  let files: string[] = [];
  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const words = content.split(/\s+/).length;
      return {
        ...(data as BlogFrontmatter),
        content,
        readingMinutes: Math.max(1, Math.round(words / 220)),
      } satisfies BlogPost;
    }),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await listBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
