import "server-only";
import { adminNavSections, type NombreIcono } from "@/components/admin/nav-items";
import type { AdminUser } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * El menu del panel = catalogo del codigo + lo que se cambio encima.
 *
 * En la base solo viven las diferencias (que se escondio, en que orden, los
 * accesos agregados a mano). Asi, cuando aparece una pantalla nueva en el
 * codigo, se ve sola: no hay que resembrar nada.
 */

export interface ItemMenu {
  label: string;
  href: string;
  icono: NombreIcono;
  seccion: string;
  orden: number;
  visible: boolean;
  /** Agregado a mano: se puede borrar. Los del catalogo solo se esconden. */
  personalizado: boolean;
}

export interface SeccionMenu {
  label: string;
  items: { label: string; href: string; icono: NombreIcono }[];
}

interface FilaMenu {
  href: string;
  label: string | null;
  seccion: string | null;
  icono: string | null;
  orden: number | null;
  visible: boolean;
  personalizado: boolean;
}

/** Una entrada que el rol no puede abrir seria un link muerto. */
function permitida(href: string, user: AdminUser): boolean {
  if (href === "/admin/sociedades" || href === "/admin/finanzas") {
    return puedeGestionarConfiguracion(user.role);
  }
  return true;
}

async function overrides(): Promise<Map<string, FilaMenu>> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_menu_items")
    .select("href, label, seccion, icono, orden, visible, personalizado");

  if (error) {
    // Sin la tabla el panel tiene que seguir navegable: se cae al catalogo.
    console.error("[menu] overrides:", error.message);
    return new Map();
  }

  return new Map(((data as FilaMenu[] | null) ?? []).map((f) => [f.href, f]));
}

/**
 * Todas las entradas con su estado, para la pantalla de configuracion.
 * Incluye las escondidas: ahi justamente se vuelven a prender.
 */
export async function catalogoDelMenu(user: AdminUser): Promise<ItemMenu[]> {
  const cambios = await overrides();
  const items: ItemMenu[] = [];
  let posicion = 0;

  for (const seccion of adminNavSections) {
    for (const item of seccion.items) {
      if (!permitida(item.href, user)) continue;

      const cambio = cambios.get(item.href);
      items.push({
        label: cambio?.label ?? item.label,
        href: item.href,
        icono: (cambio?.icono as NombreIcono) ?? item.icono,
        seccion: cambio?.seccion ?? seccion.label,
        orden: cambio?.orden ?? posicion,
        visible: cambio?.visible ?? true,
        personalizado: false,
      });
      posicion += 1;
    }
  }

  // Los agregados a mano no estan en el catalogo: van despues.
  for (const cambio of cambios.values()) {
    if (!cambio.personalizado) continue;
    items.push({
      label: cambio.label ?? cambio.href,
      href: cambio.href,
      icono: (cambio.icono as NombreIcono) ?? "Link2",
      seccion: cambio.seccion ?? "Mis accesos",
      orden: cambio.orden ?? posicion++,
      visible: cambio.visible,
      personalizado: true,
    });
  }

  return items.sort((a, b) => a.orden - b.orden);
}

/** Lo que se dibuja en el sidebar y en el menu de movil. */
export async function menuDelPanel(user: AdminUser): Promise<SeccionMenu[]> {
  const items = (await catalogoDelMenu(user)).filter((i) => i.visible);

  const secciones: SeccionMenu[] = [];
  for (const item of items) {
    let seccion = secciones.find((s) => s.label === item.seccion);
    if (!seccion) {
      seccion = { label: item.seccion, items: [] };
      secciones.push(seccion);
    }
    seccion.items.push({ label: item.label, href: item.href, icono: item.icono });
  }

  return secciones.filter((s) => s.items.length > 0);
}

/** Las secciones que ya existen, para ofrecerlas al agregar un acceso. */
export function seccionesConocidas(items: ItemMenu[]): string[] {
  return [...new Set(items.map((i) => i.seccion))];
}
