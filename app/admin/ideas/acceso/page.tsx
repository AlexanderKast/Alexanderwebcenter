import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AccesoBot } from "@/components/ideas/AccesoBot";
import { requireAuth } from "@/lib/auth";
import { listarCodigos } from "@/lib/ideas/queries";
import { puedeInvitar } from "@/lib/proyectos/permisos";
import { listarResponsables } from "@/lib/proyectos/queries";

export const metadata = { title: "Acceso al bot · Admin" };
export const dynamic = "force-dynamic";

/** El @ del bot. Solo sirve para armar el link de invitación. */
const USUARIO_BOT = "ideas_web_alex_bot";

export default async function AccesoBotPage() {
  const usuario = await requireAuth();
  if (!puedeInvitar(usuario.role)) redirect("/admin/ideas");

  const [codigos, miembros] = await Promise.all([
    listarCodigos(),
    listarResponsables(),
  ]);

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
        <h1 className="text-2xl font-semibold text-white">Acceso al bot</h1>
        <p className="max-w-2xl text-sm text-white/50">
          El bot{" "}
          <a
            href={`https://t.me/${USUARIO_BOT}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#D4AF37] hover:underline"
          >
            @{USUARIO_BOT}
          </a>{" "}
          solo escucha a quien canjeó un código. Creá uno, copiá el link y
          pasáselo: al abrirlo queda habilitado sin tipear nada.
        </p>
      </header>

      <AccesoBot codigos={codigos} miembros={miembros} usuarioBot={USUARIO_BOT} />
    </div>
  );
}
