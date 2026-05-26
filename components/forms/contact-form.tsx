"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactAction, type ContactState } from "@/app/actions/contact";

const initial: ContactState = { status: "idle" };

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
          <Send className="size-4" aria-hidden />
          Enviar mensaje
        </>
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(contactAction, initial);
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

      <div className="space-y-1">
        <Label htmlFor="contact-nombre">Nombre</Label>
        <Input
          id="contact-nombre"
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
        <Label htmlFor="contact-email">Correo</Label>
        <Input
          id="contact-email"
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

      <div className="space-y-1">
        <Label htmlFor="contact-mensaje">Cuéntame</Label>
        <textarea
          id="contact-mensaje"
          name="mensaje"
          rows={5}
          required
          aria-invalid={!!fieldErrors?.mensaje}
          className="min-h-28 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/60"
          placeholder="En que estas trabajando y como te puedo ayudar"
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
