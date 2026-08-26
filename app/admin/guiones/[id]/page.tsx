import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FormularioGuion } from "@/components/guiones/FormularioGuion";
import { requireAuth } from "@/lib/auth";
import { obtenerGuion } from "@/lib/guiones/queries";
import { colorEstado } from "@/lib/guiones/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";

interface Props {
  params: Promise<{ id: string }>;
}

const UUID = /^[0-9a-f-]{36}$/i;

export default async function GuionPage({ params }: Props) {
  const usuario = await requireAuth();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const guion = await obtenerGuion(id);
  if (!guion) notFound();

  const puedeEditar = puedeEditarProyectos(usuario.role);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/guiones"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a guiones
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">{guion.titulo}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${colorEstado(guion.estado)}`}
          >
            {guion.estado}
          </span>
        </div>

        <p className="text-sm text-white/50">
          {[guion.pilar, guion.plataforma, guion.formato].filter(Boolean).join(" · ") ||
            "Sin clasificar"}
          {guion.autorNombre ? ` · ${guion.autorNombre}` : ""}
        </p>

        {guion.link && (
          <a
            href={guion.link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm text-[#D4AF37] underline-offset-4 hover:underline"
          >
            Ver publicado <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </header>

      {/* Un tester entra a leer el guión, no a tocarlo. */}
      {puedeEditar ? (
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <FormularioGuion
            guionId={guion.id}
            inicial={{
              titulo: guion.titulo,
              pilar: guion.pilar,
              plataforma: guion.plataforma,
              formato: guion.formato,
              estado: guion.estado,
              gancho: guion.gancho,
              cuerpo: guion.cuerpo,
              notas: guion.notas,
              link: guion.link,
            }}
          />
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          {guion.gancho && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Gancho
              </p>
              <p className="mt-1.5 text-[15px] text-white/85">{guion.gancho}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Guión
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
              {guion.cuerpo || "Todavía sin escribir."}
            </p>
          </div>

          {guion.notas && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Notas
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-white/60">
                {guion.notas}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
