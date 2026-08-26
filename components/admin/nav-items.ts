import {
  LayoutDashboard,
  Users,
  Wallet,
  Mail,
  CalendarCheck,
  MessageSquare,
  FileText,
  Activity,
  UserCog,
  Palette,
  Target,
  CalendarDays,
  Video,
  Share2,
  Building2,
  Briefcase,
  Sparkles,
  UserCheck,
  ClipboardList,
  KanbanSquare,
  Handshake,
} from "lucide-react";
import type { AdminUser } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

/**
 * Menu del panel. Vivia dentro de Sidebar.tsx, que es `hidden md:flex`, asi
 * que en movil no habia ninguna forma de navegar el admin. Ahora lo comparten
 * el sidebar de escritorio y el drawer movil.
 */
export const adminNavSections: AdminNavSection[] = [
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
    label: "Interno",
    items: [
      { label: "Proyectos", href: "/admin/proyectos", icon: KanbanSquare },
      { label: "Finanzas", href: "/admin/finanzas", icon: Wallet },
      { label: "Sociedades", href: "/admin/sociedades", icon: Handshake },
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
      // Antes usaba el mismo icono Building2 que "Clientes" y las dos
      // entradas se confundian entre si en el sidebar.
      { label: "Empresas", href: "/admin/empresas", icon: Briefcase },
      { label: "Blog", href: "/admin/contenido", icon: FileText },
    ],
  },
  {
    label: "Portal de clientes",
    items: [
      { label: "Clientes", href: "/admin/clientes", icon: Building2 },
      { label: "Onboarding Clientes", href: "/clientes", icon: UserCheck },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { label: "Content Forge", href: "/admin/content-forge", icon: Sparkles },
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

/**
 * /admin/sociedades redirige si el rol no alcanza, asi que mostrarle el link
 * a todo el mundo seria dejar un link muerto.
 */
export function seccionesVisibles(user: AdminUser): AdminNavSection[] {
  return adminNavSections
    .map((seccion) => ({
      ...seccion,
      items: seccion.items.filter((item) =>
        item.href === "/admin/sociedades"
          ? puedeGestionarConfiguracion(user.role)
          : true,
      ),
    }))
    .filter((seccion) => seccion.items.length > 0);
}

/** Marca activo solo el match exacto o un descendiente real de la ruta. */
export function esRutaActiva(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
