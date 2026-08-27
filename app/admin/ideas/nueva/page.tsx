import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormularioIdea } from "@/components/ideas/FormularioIdea";
import { requireAuth } from "@/lib/auth";
import { ideaVacia } from "@/lib/ideas/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { listarProyectos } from "@/lib/proyectos/queries";

export const metadata = { title: "Nueva idea · Admin" };

export default async function NuevaIdeaPage() {
  const usuario = await requireAuth();
  if (!puedeEditarProyectos(usuario.role)) redirect("/admin/ideas");

  const proyectos = await listarProyectos();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/ideas"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a ideas
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Nueva idea</h1>
        <p className="text-sm text-white/50">
          Con el título alcanza. Lo demás se completa cuando se revise.
        </p>
      </header>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <FormularioIdea
          inicial={ideaVacia()}
          proyectos={proyectos.map((p) => ({ id: p.id, nombre: p.nombre }))}
        />
      </div>
    </div>
  );
}
