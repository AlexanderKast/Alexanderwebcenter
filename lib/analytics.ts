/**
 * Helper de tracking. Usa Vercel Analytics cuando esta disponible en el navegador.
 * En SSR o si no esta cargado, no-op silencioso.
 */

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProps = Record<string, AnalyticsValue>;

type VercelAnalytics = {
  track?: (event: string, properties?: AnalyticsProps) => void;
};

type WindowWithVA = typeof globalThis & {
  va?: VercelAnalytics;
};

/**
 * Trackea un evento custom.
 * @param event nombre del evento (p. ej. "newsletter_submit")
 * @param properties metadata opcional
 */
export function track(event: string, properties?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithVA;
  try {
    if (w.va && typeof w.va.track === "function") {
      w.va.track(event, properties);
    }
  } catch {
    // Silencioso: el tracking nunca debe romper la UI.
  }
}
