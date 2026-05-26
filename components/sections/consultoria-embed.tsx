"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "";

export function ConsultoriaEmbed() {
  const [showEmbed, setShowEmbed] = useState(false);
  const hasCal = Boolean(CAL_LINK);

  return (
    <section
      id="consultoria"
      aria-label="Agenda de consultoria estrategica"
      className="relative border-t border-white/5 bg-black py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          superlabel="Proximo paso"
          title="Agenda tu consultoria"
          description="Reserva una llamada de calificacion de 20 minutos. Si hay fit, seguimos al Intensive o al programa que aplique a tu momento."
        />

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          {hasCal && showEmbed ? (
            <div className="aspect-[4/3] w-full">
              <iframe
                title="Calendario de consultoria con Alexander Cast"
                src={`https://cal.com/${CAL_LINK}`}
                className="h-full w-full border-0"
                allow="camera; microphone; fullscreen"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 p-12 text-center md:p-20">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                <CalendarDays className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  Llamada de calificacion gratuita
                </h3>
                <p className="mx-auto max-w-xl text-sm text-white/60 md:text-base leading-relaxed">
                  20 minutos para entender tu contexto, identificar si hay fit y
                  recomendarte el formato adecuado. Sin venta forzada.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {hasCal ? (
                  <Button
                    size="lg"
                    onClick={() => setShowEmbed(true)}
                    className="h-12 gap-2 rounded-full bg-amber-400 px-6 text-sm font-semibold text-black hover:bg-amber-300"
                  >
                    Abrir calendario
                    <CalendarDays className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Link
                    href="/contacto?servicio=consultoria"
                    aria-label="Ir al formulario de contacto"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 gap-2 rounded-full bg-amber-400 px-6 text-sm font-semibold text-black hover:bg-amber-300",
                    )}
                  >
                    Solicitar llamada
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                )}
                <Link
                  href="#servicios"
                  aria-label="Ver detalle de servicios"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-12 gap-2 rounded-full border-white/20 bg-transparent px-6 text-sm font-semibold text-white hover:border-amber-400/50 hover:bg-white/5 hover:text-white",
                  )}
                >
                  Ver servicios
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
