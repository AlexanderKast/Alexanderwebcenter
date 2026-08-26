"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ICONOS } from "@/components/admin/nav-items";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

/**
 * Cambios sobre el menu del panel.
 *
 * Se guarda la diferencia contra el catalogo del codigo, no el menu entero:
 * una pantalla nueva aparece sola y esconder algo nunca borra la pagina.
 */

export type ResultadoMenu = { ok: true } | { ok: false; error: string };

const SIN_PERMISO = "Solo un founder o manager puede tocar el menú.";

const esquemaEstado = z.array(
  z.object({
    href: z.string().min(1).max(300),
    visible: z.boolean(),
    orden: z.number().int().min(0).max(999),
    seccion: z.string().trim().min(1).max(60),
    label: z.string().trim().min(1).max(60),
    personalizado: z.boolean(),
  }),
);

const esquemaAcceso = z.object({
  label: z.string().trim().min(1, "Ponele un nombre.").max(60),
  href: z
    .string()
    .trim()
    .min(1, "Falta la dirección.")
    .max(300)
    .refine(
      (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
      "Tiene que empezar con / o con https://",
    ),
  seccion: z.string().trim().min(1, "Falta la sección.").max(60),
  icono: z.string().trim().min(1).max(40),
});

export type DatosAcceso = z.infer<typeof esquemaAcceso>;

function refrescar() {
  // El menu se dibuja en el layout: hay que revalidar todo /admin.
  revalidatePath("/admin", "layout");
}

/** Guarda visibilidad, orden, nombre y sección de todas las entradas. */
export async function guardarMenu(
  items: z.infer<typeof esquemaEstado>,
): Promise<ResultadoMenu> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) {
    return { ok: false, error: SIN_PERMISO };
  }

  const parseado = esquemaEstado.safeParse(items);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const filas = parseado.data.map((i) => ({
    href: i.href,
    label: i.label,
    seccion: i.seccion,
    orden: i.orden,
    visible: i.visible,
    personalizado: i.personalizado,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await createSupabaseServiceRole()
    .from("int_menu_items")
    .upsert(filas, { onConflict: "href" });

  if (error) {
    console.error("[menu] guardar:", error.message);
    return { ok: false, error: "No pude guardar el menú." };
  }

  refrescar();
  return { ok: true };
}

/** Agrega un acceso propio: una pantalla del panel o un link de afuera. */
export async function agregarAcceso(datos: DatosAcceso): Promise<ResultadoMenu> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) {
    return { ok: false, error: SIN_PERMISO };
  }

  const parseado = esquemaAcceso.safeParse(datos);
  if (!parseado.success) {
    return { ok: false, error: parseado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const icono = parseado.data.icono in ICONOS ? parseado.data.icono : "Link2";

  const supabase = createSupabaseServiceRole();

  const { data: existe } = await supabase
    .from("int_menu_items")
    .select("href")
    .eq("href", parseado.data.href)
    .maybeSingle();

  if (existe) {
    return { ok: false, error: "Ya hay una entrada con esa dirección." };
  }

  // Al final de todo: mover se hace después con las flechas.
  const { data: ultimo } = await supabase
    .from("int_menu_items")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("int_menu_items").insert({
    href: parseado.data.href,
    label: parseado.data.label,
    seccion: parseado.data.seccion,
    icono,
    orden: ((ultimo?.orden as number | null) ?? 100) + 1,
    visible: true,
    personalizado: true,
  });

  if (error) {
    console.error("[menu] agregar:", error.message);
    return { ok: false, error: "No pude agregar el acceso." };
  }

  refrescar();
  return { ok: true };
}

/** Borra un acceso propio. Los del catálogo solo se esconden. */
export async function borrarAcceso(href: string): Promise<ResultadoMenu> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) {
    return { ok: false, error: SIN_PERMISO };
  }

  const supabase = createSupabaseServiceRole();

  const { data: item } = await supabase
    .from("int_menu_items")
    .select("personalizado")
    .eq("href", href)
    .maybeSingle();

  if (!item) return { ok: false, error: "Esa entrada ya no está." };
  if (!item.personalizado) {
    return {
      ok: false,
      error: "Esa entrada es del sistema: se puede esconder, no borrar.",
    };
  }

  const { error } = await supabase.from("int_menu_items").delete().eq("href", href);
  if (error) {
    console.error("[menu] borrar:", error.message);
    return { ok: false, error: "No pude borrar el acceso." };
  }

  refrescar();
  return { ok: true };
}

/** Vuelve el menú a como viene de fábrica. Los accesos propios se pierden. */
export async function restablecerMenu(): Promise<ResultadoMenu> {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) {
    return { ok: false, error: SIN_PERMISO };
  }

  const { error } = await createSupabaseServiceRole()
    .from("int_menu_items")
    .delete()
    .not("href", "is", null);

  if (error) {
    console.error("[menu] restablecer:", error.message);
    return { ok: false, error: "No pude restablecer el menú." };
  }

  refrescar();
  return { ok: true };
}
