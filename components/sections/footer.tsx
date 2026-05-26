import Link from "next/link";
import { Mail } from "lucide-react";

import { SocialLinks } from "@/components/shared/social-links";
import { navFooter } from "@/content/nav";
import { site } from "@/content/site";

const contactos = [
  { label: "Principal", email: site.contacto.principal },
  { label: "Comercial", email: site.contacto.comercial },
  { label: "Prensa", email: site.contacto.prensa },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Pie de pagina"
      className="relative border-t border-white/10 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div>
            <Link
              href="/"
              aria-label="Ir a la pagina principal"
              className="inline-flex size-12 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-lg font-semibold tracking-tight text-amber-400"
            >
              AC
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-400">
              {site.tagline}
            </p>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              {site.descriptionCorta}
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
              {site.ubicacion} · {site.handle}
            </p>
          </div>

          {navFooter.slice(0, 2).map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="flex flex-col gap-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                      className="text-sm text-white/70 transition-colors hover:text-amber-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              {contactos.map((c) => (
                <li key={c.email}>
                  <Link
                    href={`mailto:${c.email}`}
                    className="group/contact flex items-start gap-2 text-sm text-white/70 transition-colors hover:text-amber-400"
                    aria-label={`Enviar correo a ${c.email}`}
                  >
                    <Mail
                      className="mt-0.5 size-4 text-white/40 group-hover/contact:text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {c.label}
                      </span>
                      <span>{c.email}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Redes
              </p>
              <div className="mt-3">
                <SocialLinks variant="footer" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
            Ecosistema
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {navFooter
              .find((g) => g.title === "Ecosistema")
              ?.items.map((item) => (
                <li key={`eco-${item.label}`}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-white/70 transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>Construido con Next.js + Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
