import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";
import { DecidirIdea } from "@/components/ideas/DecidirIdea";
import { FormularioIdea } from "@/components/ideas/FormularioIdea";
import { requireAuth } from "@/lib/auth";
import { enlaceAudio, listarRespuestas, obtenerIdea } from "@/lib/ideas/queries";
import { NOMBRE_ESTADO, colorEstado, duracionLegible } from "@/lib/ideas/tipos";
import { puedeEditarProyectos } from "@/lib/proyectos/permisos";
import { listarProyectos } from "@/lib/proyectos/queries";

export const metadata = { title: "Idea · Admin" };
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default async function IdeaPage({ params }: Props) {
  const usuario = await requireAuth();
  const { id } = await params;

  const idea = await obtenerIdea(id);
  if (!idea) notFound();

  const [audio, proyectos, respuestas] = await Promise.all([
    enlaceAudio(idea.audioPath),
    listarProyectos(),
    listarRespuestas(idea.id),
  ]);

  const puedeEditar = puedeEditarProyectos(usuario.role);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/ideas"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a ideas
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">
            {idea.titulo || "Sin título"}
          </h1>
          <p className="mt-1 text-sm text-white/45">
            {idea.autorNombre || "Sin autor"} · {fecha(idea.createdAt)}
            {idea.origen === "telegram" && " · por Telegram"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${colorEstado(idea.estado)}`}
        >
          {NOMBRE_ESTADO[idea.estado]}
        </span>
      </header>

      {audio && (
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            <Mic className="h-3.5 w-3.5 text-[#D4AF37]" />
            Audio original
            {idea.audioSeg > 0 && (
              <span className="font-normal normal-case tracking-normal text-white/35">
                {duracionLegible(idea.audioSeg)}
              </span>
            )}
          </div>
          {/* La transcripción puede haber entendido mal: la voz es la prueba. */}
          <audio controls preload="none" src={audio} className="w-full">
            Tu navegador no puede reproducir este audio.
          </audio>
        </div>
      )}

      {puedeEditar && (
        <DecidirIdea
          ideaId={idea.id}
          tieneChat={idea.origen === "telegram"}
          autorNombre={idea.autorNombre || "quien la mandó"}
          respuestas={respuestas}
        />
      )}

      {puedeEditar ? (
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          <FormularioIdea
            ideaId={idea.id}
            inicial={{
              titulo: idea.titulo,
              resumen: idea.resumen,
              transcripcion: idea.transcripcion,
              tags: idea.tags,
              estado: idea.estado,
              proyectoId: idea.proyectoId,
              notas: idea.notas,
            }}
            proyectos={proyectos.map((p) => ({ id: p.id, nombre: p.nombre }))}
          />
        </div>
      ) : (
        // El tester lee la bandeja pero no la toca.
        <div className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
          {idea.resumen && (
            <p className="text-sm leading-relaxed text-white/70">{idea.resumen}</p>
          )}
          {idea.transcripcion && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/55">
              {idea.transcripcion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
