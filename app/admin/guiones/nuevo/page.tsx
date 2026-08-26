import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormularioGuion } from "@/components/guiones/FormularioGuion";
import { requireAuth } from "@/lib/auth";
import { guionVacio } from "@/lib/guiones/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";

export const metadata = { title: "Nuevo guión · Admin" };

export default async function NuevoGuionPage() {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) redirect("/admin/guiones");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/guiones"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a guiones
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Nuevo guión</h1>
        <p className="text-sm text-white/50">
          Podés guardarlo como idea con el título solo y volver después a
          escribirlo.
        </p>
      </header>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <FormularioGuion inicial={guionVacio()} />
      </div>
    </div>
  );
}
