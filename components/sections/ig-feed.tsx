import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, AtSign } from "lucide-react";

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/effects/reveal";
import { site } from "@/content/site";
import posts from "@/content/ig-posts.json";

type IgPost = {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  likes?: number;
  comments?: number;
  type?: "image" | "video" | "carousel";
};

export function IgFeed() {
  const items = (posts.posts as IgPost[]).slice(0, 9);
  const empty = items.length === 0;

  return (
    <section
      id="instagram"
      aria-label="Instagram feed"
      className="relative border-t border-[color:var(--line)] bg-[color:var(--background)] py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              superlabel="Instagram"
              title={site.social.instagram.handle}
              description="Mi cuenta principal. Contenido diario sobre estrategia, IA y proceso real."
            />
            <Link
              href={site.social.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="btn-gold-outline h-11"
            >
              <Instagram className="size-4" aria-hidden />
              Seguir
            </Link>
          </div>
          <div className="section-divider section-divider-left" />
        </Reveal>

        {empty ? (
          <Reveal direction="up" delay={0.1}>
            <div className="mt-12 rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface-1)] p-10 text-center">
              <Instagram className="mx-auto size-10 text-[color:var(--gold-mid)]/70" aria-hidden />
              <p className="mt-4 font-display text-xl text-white">
                Feed pendiente de sincronizar
              </p>
              <p className="mt-2 text-sm text-white/55">
                Corre <code className="rounded bg-black/50 px-2 py-0.5 text-xs">node scripts/scrape-instagram.mjs</code> con tu <code>APIFY_TOKEN</code> para traer los últimos posts de {site.social.instagram.handle}.
              </p>
              <Link
                href={site.social.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-metallic mt-6"
              >
                <Instagram className="size-4" aria-hidden />
                Ir al perfil
              </Link>
            </div>
          </Reveal>
        ) : (
          <RevealStagger staggerChildren={0.05} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {items.map((p) => (
              <RevealItem key={p.id} direction="up">
                <Link
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/tile zoom-in relative block aspect-square overflow-hidden rounded-2xl border border-[color:var(--line)]"
                >
                  <Image
                    src={p.thumbnail}
                    alt={p.caption?.slice(0, 80) ?? `Post ${p.id}`}
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:768px) 32vw, 48vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
                    <div className="w-full p-4 text-xs text-white">
                      <div className="flex items-center gap-3">
                        {typeof p.likes === "number" ? (
                          <span className="inline-flex items-center gap-1">
                            <Heart className="size-3.5 text-[color:var(--gold-mid)]" /> {p.likes}
                          </span>
                        ) : null}
                        {typeof p.comments === "number" ? (
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="size-3.5 text-[color:var(--gold-mid)]" /> {p.comments}
                          </span>
                        ) : null}
                      </div>
                      {p.caption ? (
                        <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-white/80">
                          {p.caption}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </div>
    </section>
  );
}
