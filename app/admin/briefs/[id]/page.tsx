import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { obtenerEnvio, respuestasDe } from "@/lib/brief/consultas";
import { conMarca, resolverCliente, seccionesPara } from "@/lib/brief/schema";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const UUID = /^[0-9a-f-]{36}$/i;
const IMAGEN = /\.(png|jpe?g|webp|gif|svg)(\?|$)/i;

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      });
}

export default async function BriefPage({ params }: Props) {
  await requireAuth();

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const envio = await obtenerEnvio(id);
  if (!envio) notFound();

  const respuestas = await respuestasDe(id);
  const cliente = resolverCliente(envio.cliente);
  const secciones = seccionesPara(envio.sector || cliente.sector);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/briefs"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      {/* Ficha de contacto: lo primero que se necesita para responderle */}
      <header className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              {envio.marca}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              {envio.contactoNombre || "Sin nombre"}
            </h1>
            <p className="mt-2 text-sm text-white/60">{envio.empresa || "Sin empresa"}</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-semibold text-[#D4AF37]">{envio.completadoPct}%</p>
            <p className="text-xs text-white/40">
              {envio.respondidas} de {envio.totalCampos} respuestas
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {envio.contactoTel && (
            <a
              href={`https://wa.me/${envio.contactoTel.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl border border-white/15 px-4 py-2 text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              WhatsApp {envio.contactoTel}
            </a>
          )}
          {envio.contactoEmail && (
            <a
              href={`mailto:${envio.contactoEmail}`}
              className="rounded-xl border border-white/15 px-4 py-2 text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              {envio.contactoEmail}
            </a>
          )}
        </div>

        <p className="mt-4 text-xs text-white/35">Enviado el {fecha(envio.createdAt)}</p>
      </header>

      {/* El formulario tal cual lo vio la persona: todas las preguntas, en
          orden, con lo que respondio o el hueco que dejo. */}
      <div className="space-y-5">
        {secciones.map((seccion) => {
          const campos = seccion.f;
          const llenos = campos.filter((campo) => respuestas.has(campo.id)).length;

          return (
            <section
              key={seccion.n}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6"
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">
                  {seccion.n}. {conMarca(seccion.t, envio.marca)}
                </h2>
                <span className="shrink-0 text-xs text-white/35">
                  {llenos}/{campos.length}
                </span>
              </div>

              <dl className="mt-4 space-y-4">
                {campos.map((campo) => {
                  const valor = respuestas.get(campo.id) ?? "";
                  const esUrl = /^https?:\/\//i.test(valor);
                  const esImagen = esUrl && IMAGEN.test(valor);

                  return (
                    <div
                      key={campo.id}
                      className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                    >
                      <dt className="text-sm text-white/45">
                        {conMarca(campo.l, envio.marca)}
                      </dt>
                      <dd className="mt-1.5">
                        {valor === "" ? (
                          <span className="text-sm italic text-white/25">Sin responder</span>
                        ) : esImagen ? (
                          <a href={valor} target="_blank" rel="noreferrer noopener">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={valor}
                              alt={campo.l}
                              className="max-h-56 rounded-xl border border-white/10 bg-black/40 object-contain p-2"
                            />
                          </a>
                        ) : esUrl ? (
                          <a
                            href={valor}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="break-all text-[#D4AF37] underline underline-offset-4"
                          >
                            {valor}
                          </a>
                        ) : (
                          <span className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
                            {valor}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}
