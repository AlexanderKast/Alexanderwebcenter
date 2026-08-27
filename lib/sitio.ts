/**
 * La direccion publica del sitio.
 *
 * Se usa para armar links que salen de la app: el que llega por Telegram
 * cuando se guarda una idea, el comando para conectar el MCP. Sin dominio
 * esos links no sirven — un `/api/mcp` pelado no se puede pegar en ningun
 * lado.
 *
 * `NEXT_PUBLIC_SITE_URL` manda cuando esta, pero no siempre esta: es una
 * variable que hay que acordarse de cargar a mano en cada entorno. Cuando
 * falta, Vercel ya sabe cual es el dominio de produccion y lo pone solo.
 */
export function urlDelSitio(): string {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicita) return explicita.replace(/\/+$/, "");

  const deVercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  return deVercel ? `https://${deVercel.replace(/\/+$/, "")}` : "";
}
