"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  leadMagnetAction,
  type LeadMagnetState,
} from "@/app/actions/lead-magnet";

const initial: LeadMagnetState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[color:var(--gold)] text-[color:var(--brand)] hover:bg-[color:var(--gold-soft)]"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <>
          <Download className="size-4" aria-hidden />
          Descargar gratis
        </>
      )}
    </Button>
  );
}

export function LeadMagnetForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(leadMagnetAction, initial);
  const isError = state.status === "error";
  const fieldErrors = isError && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-3" noValidate>
      <input type="hidden" name="leadMagnetSlug" value={slug} />
      <label className="sr-only" aria-hidden>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>

      <div className="space-y-1">
        <Label htmlFor={`nombre-${slug}`} className="text-xs text-white/70">
          Nombre (opcional)
        </Label>
        <Input
          id={`nombre-${slug}`}
          name="nombre"
          autoComplete="given-name"
          placeholder="Como te llamas"
          className="border-white/15 bg-white/5"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={`email-${slug}`} className="text-xs text-white/70">
          Correo
        </Label>
        <Input
          id={`email-${slug}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={!!fieldErrors?.email}
          className="border-white/15 bg-white/5"
        />
        {fieldErrors?.email ? (
          <p className="text-xs text-red-400">{fieldErrors.email}</p>
        ) : null}
      </div>

      <Submit />

      {isError && !fieldErrors?.email ? (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
