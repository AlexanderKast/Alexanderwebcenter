"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  CalendarCheck,
  MessageSquare,
  FileText,
  Activity,
  UserCog,
  Settings,
  Palette,
  Target,
  CalendarDays,
  Video,
  Share2,
  Building2,
  Sparkles,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import type { AdminUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard };
type Section = { label: string; items: NavItem[] };

const sections: Section[] = [
  {
    label: "Operación",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Leads", href: "/admin/leads", icon: Users },
      { label: "Suscriptores", href: "/admin/suscriptores", icon: Mail },
      { label: "Consultorías", href: "/admin/consultorias", icon: CalendarCheck },
      { label: "Mensajes", href: "/admin/mensajes", icon: MessageSquare },
      { label: "Briefs de marca", href: "/admin/briefs", icon: ClipboardList },
    ],
  },
  {
    label: "Marca personal",
    items: [
      { label: "Manual de marca", href: "/admin/marca", icon: Palette },
      { label: "Estrategia", href: "/admin/estrategia", icon: Target },
      { label: "Plan de contenido", href: "/admin/contenido-plan", icon: CalendarDays },
      { label: "Guiones", href: "/admin/guiones", icon: Video },
      { label: "Plataformas", href: "/admin/plataformas", icon: Share2 },
      { label: "Empresas", href: "/admin/empresas", icon: Building2 },
      { label: "Blog", href: "/admin/contenido", icon: FileText },
    ],
  },
  {
    label: "Portal de clientes",
    items: [
      { label: "Clientes", href: "/admin/clientes", icon: Building2 },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { label: "Content Forge", href: "/admin/content-forge", icon: Sparkles },
      { label: "Onboarding Clientes", href: "/clientes", icon: UserCheck },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Actividad", href: "/admin/actividad", icon: Activity },
      { label: "Equipo", href: "/admin/equipo", icon: UserCog },
    ],
  },
];

export function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[color:var(--line)] bg-[color:var(--background)] md:flex">
      <div className="flex items-center gap-3 border-b border-[color:var(--line)] px-6 py-5">
        <Image
          src="/logos/ac-gold-mark.png"
          alt="Alexander Cast"
          width={120}
          height={70}
          className="h-8 w-auto"
          priority
        />
        <div>
          <p className="font-display text-sm font-semibold text-white">Alexander Cast</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold-mid)]">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Menú admin">
        {sections.map((sec) => (
          <div key={sec.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
              {sec.label}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-[color:var(--gold-mid)]/10 text-[color:var(--gold-mid)] border border-[color:var(--gold-mid)]/20"
                        : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[color:var(--line)] p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[color:var(--gold-dark)] to-[color:var(--gold-mid)] font-display text-xs font-bold text-black">
            {(user.fullName ?? user.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user.fullName ?? user.email}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--gold-mid)]">
              {user.role}
            </p>
          </div>
          <Link
            href="/admin/configuracion"
            aria-label="Configuración"
            className="grid size-8 place-items-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
