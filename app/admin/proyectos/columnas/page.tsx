import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  borrarColumna,
  crearColumna,
  moverColumna,
  renombrarColumna,
} from "@/app/actions/kanban-columnas";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";
import { listarColumnas } from "@/lib/proyectos/queries";

export const metadata = { title: "Columnas del tablero · Admin" };

const INPUT =
  "rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white/80 focus:border-[#D4AF37]/40 focus:outline-none";

async function accionCrear(formData: FormData) {
  "use server";
  await crearColumna(formData);
}

async function accionRenombrar(formData: FormData) {
  "use server";
  await renombrarColumna(formData);
}

async function accionBorrar(formData: FormData) {
  "use server";
  await borrarColumna(String(formData.get("columnaId") ?? ""));
}

async function accionMover(formData: FormData) {
  "use server";
  await moverColumna(
    String(formData.get("columnaId") ?? ""),
    formData.get("direccion") === "arriba" ? "arriba" : "abajo",
  );
}

export default async function ColumnasPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin/proyectos");

  const columnas = await listarColumnas();

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/proyectos"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al tablero
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Columnas del tablero</h1>
        <p className="text-sm text-white/50">
          Estas son las etapas por las que pasa un proyecto. Una columna con
          proyectos adentro no se puede borrar.
        </p>
      </header>

      <ul className="space-y-2">
        {columnas.map((columna) => (
          <li
            key={columna.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 p-3"
          >
            <form action={accionRenombrar} className="flex flex-1 flex-wrap gap-2">
              <input type="hidden" name="columnaId" value={columna.id} />
              <input
                name="nombre"
                defaultValue={columna.nombre}
                aria-label={`Nombre de ${columna.nombre}`}
                className={`${INPUT} flex-1`}
              />
              <input
                name="color"
                defaultValue={columna.color}
                aria-label={`Color de ${columna.nombre}`}
                className={`${INPUT} flex-1`}
              />
              <button
                type="submit"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:text-white"
              >
                Guardar
              </button>
            </form>

            <form action={accionMover}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <input type="hidden" name="direccion" value="arriba" />
              <button type="submit" aria-label={`Subir ${columna.nombre}`} className="px-2 text-white/40 hover:text-white">
                ↑
              </button>
            </form>

            <form action={accionMover}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <input type="hidden" name="direccion" value="abajo" />
              <button type="submit" aria-label={`Bajar ${columna.nombre}`} className="px-2 text-white/40 hover:text-white">
                ↓
              </button>
            </form>

            <form action={accionBorrar}>
              <input type="hidden" name="columnaId" value={columna.id} />
              <button
                type="submit"
                className="px-2 text-sm text-white/40 hover:text-red-400"
              >
                Borrar
              </button>
            </form>

            {columna.esInicial && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                inicial
              </span>
            )}
            {columna.esFinal && (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                final
              </span>
            )}
          </li>
        ))}
      </ul>

      <form
        action={accionCrear}
        className="flex flex-wrap gap-2 rounded-xl border border-dashed border-white/10 p-3"
      >
        <input name="nombre" placeholder="Columna nueva" className={`${INPUT} flex-1`} required />
        <input
          name="color"
          placeholder="bg-white/10 text-white/60"
          defaultValue="bg-white/10 text-white/60"
          className={`${INPUT} flex-1`}
        />
        <button
          type="submit"
          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
