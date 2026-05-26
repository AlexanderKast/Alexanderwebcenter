"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribeAction, type SubscribeState } from "@/app/actions/subscribe";

const initial: SubscribeState = { status: "idle" };

function Submit({ label = "Suscribirme" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 bg-[color:var(--gold)] text-[color:var(--brand)] hover:bg-[color:var(--gold-soft)] sm:min-w-40"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <>
          {label}
          <ArrowRight className="size-4" aria-hidden />
        </>
      )}
    </Button>
  );
}

export function NewsletterForm({
  source = "home",
  pilar,
  label,
  variant = "inline",
}: {
  source?: string;
  pilar?: string;
  label?: string;
  variant?: "inline" | "stacked";
}) {
  const [state, formAction] = useActionState(subscribeAction, initial);
  const isError = state.status === "error";
  const emailError =
    isError && "fieldErrors" in state ? state.fieldErrors?.email : undefined;

  const layout =
    variant === "inline"
      ? "flex flex-col gap-3 sm:flex-row sm:items-start"
      : "flex flex-col gap-3";

  return (
    <form action={formAction} className={layout} noValidate>
      <input type="hidden" name="source" value={source} />
      {pilar ? <input type="hidden" name="pilar" value={pilar} /> : null}
      <label className="sr-only" aria-hidden>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>

      <div className="flex-1 space-y-1">
        <Label htmlFor="newsletter-email" className="sr-only">
          Correo electrónico
        </Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={!!emailError}
          className="h-12 border-white/15 bg-white/5 text-base placeholder:text-white/40 focus-visible:ring-[color:var(--gold)]/60"
        />
        {emailError ? (
          <p className="text-xs text-red-400">{emailError}</p>
        ) : null}
      </div>

      <Submit label={label} />

      {isError && !emailError ? (
        <p
          role="alert"
          className="basis-full text-sm text-red-400"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
