"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  consultationAction,
  type ConsultationState,
} from "@/app/actions/consultation";

const initial: ConsultationState = { status: "idle" };

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
          <CalendarCheck className="size-4" aria-hidden />
          Solicitar consultoria
        </>
      )}
    </Button>
  );
}

const servicios = [
  { value: "strategy-intensive", label: "Cast Strategy Intensive" },
  { value: "mentoring", label: "Cast Mentoring (3 meses)" },
  { value: "workshop", label: "Workshop para equipos" },
  { value: "otros", label: "Otro" },
] as const;

export function ConsultationForm() {
  const [state, formAction] = useActionState(consultationAction, initial);
  const isError = state.status === "error";
  const fieldErrors = isError && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <label className="sr-only" aria-hidden>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="cs-nombre">Nombre</Label>
          <Input
            id="cs-nombre"
            name="nombre"
            required
            autoComplete="name"
            aria-invalid={!!fieldErrors?.nombre}
            className="border-white/15 bg-white/5"
          />
          {fieldErrors?.nombre ? (
            <p className="text-xs text-red-400">{fieldErrors.nombre}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="cs-email">Correo</Label>
          <Input
            id="cs-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!fieldErrors?.email}
            className="border-white/15 bg-white/5"
          />
          {fieldErrors?.email ? (
            <p className="text-xs text-red-400">{fieldErrors.email}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="cs-slot">Servicio que te interesa</Label>
        <select
          id="cs-slot"
          name="slot"
          defaultValue="strategy-intensive"
          className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
        >
          {servicios.map((s) => (
            <option key={s.value} value={s.value} className="bg-background">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="cs-mensaje">Sobre tu proyecto</Label>
        <textarea
          id="cs-mensaje"
          name="mensaje"
          rows={5}
          required
          aria-invalid={!!fieldErrors?.mensaje}
          className="min-h-28 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
          placeholder="Contexto, etapa, presupuesto aproximado y lo que esperas lograr."
        />
        {fieldErrors?.mensaje ? (
          <p className="text-xs text-red-400">{fieldErrors.mensaje}</p>
        ) : null}
      </div>

      <Submit />

      {isError && !fieldErrors ? (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
