/**
 * Constantes no sensibles compartidas en el proyecto.
 */

export const SITE_DOMAIN = "alexandercast.com";

/**
 * URLs canonicas de descargas (para que Resend y rutas dinamicas apunten al mismo lugar).
 * Los archivos viven en /public/downloads/<slug>.<ext> o bien detras de Supabase Storage.
 */
export const DOWNLOAD_BASE_PATH = "/descargas";

export const DOWNLOAD_FILES: Record<string, string> = {
  "el-sistema-dei": "/downloads/el-sistema-dei.pdf",
  "canvas-marca-personal":
    "https://www.notion.so/canvas-marca-personal-alexandercast",
  "10-prompts-ia-estrategas": "/downloads/10-prompts-ia-estrategas.pdf",
};

/**
 * Rutas reservadas del sitio. Evitar generar slugs que colisionen.
 */
export const RESERVED_ROUTES: readonly string[] = [
  "/",
  "/blog",
  "/descargas",
  "/gracias",
  "/contacto",
  "/legal",
  "/legal/privacidad",
  "/legal/terminos",
  "/api",
  "/admin",
] as const;

export const LIMITS = {
  /** Largo maximo del mensaje de contacto. */
  contactoMensajeMax: 4000,
  /** Rate limit: peticiones por IP / 10 min */
  formsPorIP: 5,
  /** Rate limit: envios por email / hora */
  envioPorEmail: 3,
  /** Largo maximo del nombre. */
  nombreMax: 80,
} as const;

export const THANK_YOU_COPY: Record<
  "newsletter" | "lead" | "consulta" | "contacto",
  { titulo: string; mensaje: string }
> = {
  newsletter: {
    titulo: "Gracias por unirte.",
    mensaje:
      "Revisa tu correo: te acabo de enviar la confirmacion de bienvenida al ecosistema.",
  },
  lead: {
    titulo: "Tu descarga esta en camino.",
    mensaje:
      "Te envie el recurso al correo que dejaste. Si no llega en unos minutos, revisa la carpeta de promociones o spam.",
  },
  consulta: {
    titulo: "Recibi tu solicitud.",
    mensaje:
      "Voy a revisar tu caso personalmente. Si hay fit, te escribo en menos de 48 horas para coordinar la sesion.",
  },
  contacto: {
    titulo: "Mensaje recibido.",
    mensaje: "Te respondere personalmente en los proximos dias habiles.",
  },
};
