"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/nav/mobile-menu";
import { LogoGold } from "@/components/shared/logo-gold";
import { site } from "@/content/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const SPY_IDS = [
  "top",
  "problema",
  "beneficios",
  "recurso",
  "consultoria",
  "autoridad",
  "testimonios",
  "faqs",
];

const navItems: { label: string; href: string; anchor?: string }[] = [
  { label: "Problema", href: "/#problema", anchor: "problema" },
  { label: "Beneficios", href: "/#beneficios", anchor: "beneficios" },
  { label: "Recurso", href: "/#recurso", anchor: "recurso" },
  { label: "Consultoría", href: "/consultoria" },
  { label: "Formulario", href: "/brief" },
  { label: "Blog", href: "/blog" },
];

export function SiteHeader() {
  const active = useScrollSpy(SPY_IDS);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent supports-[backdrop-filter]:bg-transparent sda-header">
      <div className="container-wide flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={`${site.name} — inicio`}
        >
          <LogoGold variant="mark" className="h-9 w-auto md:h-10" priority />
          <span className="hidden font-display text-base font-semibold tracking-tight text-white/90 sm:inline">
            {site.name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => {
            const isActive = item.anchor ? active === item.anchor : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "text-[color:var(--gold-mid)]"
                    : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-[2px] h-[2px] bg-gradient-to-r from-[color:var(--gold-dark)] via-[color:var(--gold-light)] to-[color:var(--gold-dark)]"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#recurso"
            className="btn-gold-metallic hidden h-10 min-w-0 px-5 text-xs sm:inline-flex"
          >
            Descargar gratis
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
