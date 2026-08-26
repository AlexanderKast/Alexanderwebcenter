import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import {
  listarParticipaciones,
  listarSociedades,
} from "@/lib/proyectos/queries";

export const metadata = { title: "Sociedades · Admin" };

export default async function SociedadesPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin/proyectos");

  const [sociedades, participaciones] = await Promise.all([
    listarSociedades(),
    listarParticipaciones(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Sociedades y socios</h1>
        <p className="text-sm text-white/50">
          La fuente de verdad de los porcentajes sigue siendo el Google Sheet.
          Acá se ven como quedaron después de la última importación.
        </p>
      </header>

      <div className="space-y-4">
        {sociedades.map((sociedad) => {
          const suyos = participaciones.filter((p) => p.sociedadId === sociedad.id);
          const suma = suyos.reduce((total, p) => total + p.pct, 0);

          return (
            <section
              key={sociedad.id}
              className="rounded-xl border border-white/10 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium text-white">
                  {sociedad.nombre}
                  {!sociedad.activa && (
                    <span className="ml-2 rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                      contable
                    </span>
                  )}
                </h2>
                {suyos.length > 0 && (
                  <span
                    className={`text-xs ${
                      Math.round(suma) === 100 ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    Suma {suma.toFixed(1)}%
                  </span>
                )}
              </div>

              {sociedad.descripcion && (
                <p className="mt-1 text-sm text-white/50">{sociedad.descripcion}</p>
              )}

              {suyos.length === 0 ? (
                <p className="mt-3 text-sm text-white/40">Sin socios cargados.</p>
              ) : (
                <ul className="mt-3 space-y-1">
                  {suyos.map((p) => (
                    <li
                      key={`${p.sociedadId}-${p.socioId}`}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-white/80">{p.socioNombre}</span>
                      <span className="flex-1 border-b border-dashed border-white/10" />
                      <span className="text-white/60">{p.pct.toFixed(1)}%</span>
                      {p.rolNotas && (
                        <span className="max-w-xs truncate text-xs text-white/35">
                          {p.rolNotas}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
