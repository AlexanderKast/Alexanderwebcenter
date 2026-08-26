import type { EstadisticasTablero } from "@/lib/proyectos/types";

function Tarjeta({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-white/40">{etiqueta}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{valor}</p>
    </div>
  );
}

export function Estadisticas({ datos }: { datos: EstadisticasTablero }) {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tarjeta etiqueta="Activos" valor={String(datos.activos)} />
        <Tarjeta etiqueta="Sin tomar" valor={String(datos.sinResponsable)} />
        <Tarjeta
          etiqueta="Entregados este mes"
          valor={String(datos.entregadosEsteMes)}
        />
        <Tarjeta
          etiqueta="Días promedio"
          valor={datos.diasPromedioCiclo === null ? "—" : String(datos.diasPromedioCiclo)}
        />
      </div>

      {datos.porResponsable.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {datos.porResponsable.map((r) => (
            <span
              key={r.nombre}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
            >
              {r.nombre}: {r.total}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
