"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  skillsLeadAction,
  type SkillsLeadState,
} from "@/app/actions/skills-lead";
import { COUNTRY_CODES } from "./data";

const initial: SkillsLeadState = { status: "idle" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "14px 16px",
  fontFamily: "var(--font-dm)",
  fontSize: 15,
  color: "#fff",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm)",
  fontSize: 11,
  letterSpacing: "2px",
  color: "var(--texto-suave)",
  display: "block",
  marginBottom: 8,
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: "100%",
        fontFamily: "var(--font-bebas)",
        fontSize: 16,
        letterSpacing: "2.5px",
        color: "#000",
        background: "var(--gold)",
        border: "none",
        padding: "18px 36px",
        cursor: pending ? "wait" : "pointer",
        opacity: pending ? 0.7 : 1,
        transition: "all .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--gold)";
      }}
    >
      {pending ? "ENVIANDO..." : "ENVIARME LAS SKILLS"}
      <span style={{ fontSize: 20 }}>→</span>
    </button>
  );
}

export function SkillsLeadForm({ idPrefix }: { idPrefix: string }) {
  const [state, formAction] = useActionState(skillsLeadAction, initial);
  const isError = state.status === "error";
  const fieldErrors = isError ? state.fieldErrors : undefined;

  return (
    <form
      action={formAction}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: 18, textAlign: "left" }}
    >
      <label style={{ position: "absolute", left: -9999 }} aria-hidden>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>

      <div>
        <label htmlFor={`${idPrefix}-nombre`} style={labelStyle}>
          NOMBRE
        </label>
        <input
          id={`${idPrefix}-nombre`}
          name="nombre"
          required
          autoComplete="given-name"
          placeholder="¿Cómo te llamas?"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
          }
        />
        {fieldErrors?.nombre ? (
          <p style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "#f87171", marginTop: 6 }}>
            {fieldErrors.nombre}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${idPrefix}-whatsapp`} style={labelStyle}>
          WHATSAPP
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            id={`${idPrefix}-country`}
            name="countryCode"
            defaultValue="+57"
            aria-label="Código de país"
            style={{
              ...inputStyle,
              width: 140,
              flexShrink: 0,
              appearance: "none",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {COUNTRY_CODES.map((c) => (
              <option
                key={c.code + c.pais}
                value={c.code}
                style={{ background: "#111", color: "#fff" }}
              >
                {c.pais} {c.code}
              </option>
            ))}
          </select>
          <input
            id={`${idPrefix}-whatsapp`}
            name="whatsapp"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="300 123 4567"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
            }
          />
        </div>
        {fieldErrors?.whatsapp || fieldErrors?.countryCode ? (
          <p style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "#f87171", marginTop: 6 }}>
            {fieldErrors?.whatsapp ?? fieldErrors?.countryCode}
          </p>
        ) : null}
      </div>

      <Submit />

      {isError && !fieldErrors ? (
        <p role="alert" style={{ fontFamily: "var(--font-dm)", fontSize: 13, color: "#f87171" }}>
          {state.message}
        </p>
      ) : null}

      <p style={{ fontFamily: "var(--font-dm)", fontSize: 11, letterSpacing: "1px", color: "var(--texto-tenue)" }}>
        SIN SPAM. SOLO EL PACK Y ESTRATEGIA IA FIRST.
      </p>
    </form>
  );
}
