"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { leadMagnetAction, type LeadMagnetState } from "@/app/actions/lead-magnet";

const initial: LeadMagnetState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold-metallic w-full sm:w-auto">
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <>
          <Download className="size-4" aria-hidden />
          Descargar gratis
          <ArrowRight className="size-4" aria-hidden />
        </>
      )}
    </button>
  );
}

export function HeroFormCapture({ slug = "10-prompts-ia-estrategas" }: { slug?: string }) {
  const [state, formAction] = useActionState(leadMagnetAction, initial);
  const isError = state.status === "error";
  const fieldErrors = isError && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} noValidate className="w-full max-w-xl">
      <input type="hidden" name="leadMagnetSlug" value={slug} />
      <label className="sr-only" aria-hidden>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex-1">
          <label htmlFor="hero-email" className="sr-only">Correo electrónico</label>
          <Input
            id="hero-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-invalid={!!fieldErrors?.email}
            className="h-14 rounded-full border-[color:var(--line)] bg-[color:var(--surface-1)]/80 px-5 text-base text-white placeholder:text-white/40 backdrop-blur focus-visible:border-[color:var(--gold-mid)] focus-visible:ring-2 focus-visible:ring-[color:var(--gold-mid)]/40"
          />
        </div>
        <Submit />
      </div>

      <p className="mt-3 text-xs text-white/45">
        {fieldErrors?.email ? (
          <span className="text-red-400">{fieldErrors.email}</span>
        ) : isError ? (
          <span className="text-red-400">{state.message}</span>
        ) : (
          <>Sin spam · Solo valor real · Cancelas cuando quieras</>
        )}
      </p>
    </form>
  );
}
