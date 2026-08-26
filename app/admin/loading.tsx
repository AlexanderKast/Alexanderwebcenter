/**
 * El panel no tenia ningun loading.tsx: las 25 paginas son server components
 * async, asi que al navegar la pantalla se quedaba con el contenido viejo
 * congelado sin ninguna senal de que algo estaba cargando.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-8" role="status" aria-live="polite">
      <span className="sr-only">Cargando…</span>

      <header className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-[color:var(--surface-3)]" />
        <div className="h-9 w-64 animate-pulse rounded bg-[color:var(--surface-2)]" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[color:var(--surface-2)]" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)]"
          />
        ))}
      </div>

      <div className="space-y-px overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 flex-1 animate-pulse rounded bg-[color:var(--surface-3)]" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-[color:var(--surface-2)] sm:block" />
            <div className="hidden h-4 w-20 animate-pulse rounded bg-[color:var(--surface-2)] md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
