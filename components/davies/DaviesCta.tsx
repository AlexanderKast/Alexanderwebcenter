"use client";
import { useState } from "react";

interface FormState {
  nombre: string;
  email: string;
  servicio: string;
  presupuesto: string;
  mensaje: string;
}

export function DaviesCta() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    servicio: "",
    presupuesto: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
    } catch {
      // silencioso — no bloquear UX
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-cta flat-spacing" id="contactScroll">
      <div className="bg-img">
        <img loading="lazy" width={1440} height={1081} src="/assets/images/item/bg-3.png" alt="" />
      </div>
      <div className="s-header d-block">
        <div className="container">
          <div className="row">
            <div className="col-2 offset-lg-2 col-lg-2">
              <div className="col-left">
                <a href="/" className="logo-custom">
                  <div className="logo-site-sv">
                    <svg
                      width="34"
                      height="41"
                      viewBox="0 0 34 41"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.21094 0.400391C15.9908 0.392629 21.8983 0.597548 27.1426 5.65918C35.1922 13.4293 35.2468 26.7035 27.5312 34.7549C22.0053 40.1145 16.6295 40.3989 9.48535 40.4004L0.75 40.3945L0.751953 0.407227L9.21094 0.400391ZM21.5244 6.83496C16.6613 3.86011 10.4273 4.54391 4.91113 4.55664L17.2607 22.3262C19.5017 25.5466 21.7744 28.9254 24.0615 32.0889C24.847 31.468 25.7087 30.3488 26.2646 29.5088C28.7144 25.5207 29.444 20.7119 28.2871 16.1777C27.305 12.2252 25.0035 8.9637 21.5244 6.83496Z"
                        fill="#C9A84C"
                      />
                    </svg>
                  </div>
                  <span className="line-vertical left"></span>
                  <span className="line-vertical right"></span>
                  <span className="line-horizontal top"></span>
                  <span className="line-horizontal bottom"></span>
                </a>
              </div>
            </div>
            <div className="col-10 col-lg-6">
              <h2 className="text-display-2 letter-space--3 text-end effectFade fadeUp">
                Construyamos tu <br />
                sistema juntos
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div
              style={{
                border: "1px solid var(--primary)",
                padding: "20px 24px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <p className="text-body-1 mb-0">
                Descarga gratis:{" "}
                <strong>50 Prompts de Marketing con IA</strong> — completa el
                formulario y te lo envío directo.
              </p>
              <span className="text-primary text-caption fw-medium letter-space--1">
                PDF GRATUITO
              </span>
            </div>

            {sent ? (
              <div className="text-center" style={{ padding: "40px 0" }}>
                <h4 className="text-primary letter-space--2">¡Mensaje recibido!</h4>
                <p className="text-white-64">Te respondo en menos de 24 horas.</p>
              </div>
            ) : (
              <form className="form-cta" onSubmit={handleSubmit}>
                <div className="form-content">
                  <div className="tf-grid-layout sm-col-2">
                    <fieldset className="tf-field">
                      <input
                        className="tf-input"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        aria-label="Nombre"
                      />
                      <label className="tf-lable">
                        Nombre <span className="text-primary">*</span>
                      </label>
                    </fieldset>
                    <fieldset className="tf-field">
                      <input
                        className="tf-input"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-label="Email"
                      />
                      <label className="tf-lable">
                        Email <span className="text-primary">*</span>
                      </label>
                    </fieldset>
                  </div>
                  <div className="tf-grid-layout sm-col-2">
                    <fieldset className="tf-field">
                      <select
                        className="tf-input"
                        value={form.servicio}
                        onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                        aria-label="Servicio de interés"
                        style={{ background: "transparent", color: "inherit" }}
                      >
                        <option value="">Servicio de interés</option>
                        <option value="estrategia">Estrategia Digital con IA</option>
                        <option value="automatizaciones">Automatizaciones &amp; Agentes IA</option>
                        <option value="contenido">Contenido con IA</option>
                      </select>
                    </fieldset>
                    <fieldset className="tf-field">
                      <select
                        className="tf-input"
                        value={form.presupuesto}
                        onChange={(e) => setForm({ ...form, presupuesto: e.target.value })}
                        aria-label="Presupuesto"
                        style={{ background: "transparent", color: "inherit" }}
                      >
                        <option value="">Presupuesto en USD</option>
                        <option value="1000-3000">$1,000 – $3,000</option>
                        <option value="3000-5000">$3,000 – $5,000</option>
                        <option value="5000+">$5,000+</option>
                      </select>
                    </fieldset>
                  </div>
                  <fieldset className="tf-field">
                    <input
                      className="tf-input"
                      type="text"
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      aria-label="Cuéntame tu proyecto"
                    />
                    <label className="tf-lable">Cuéntame tu proyecto</label>
                  </fieldset>
                </div>
                <div className="form-action">
                  <button type="submit" className="tf-btn" disabled={loading}>
                    <span className="text-caption">
                      {loading ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                    </span>
                  </button>
                  <p className="text-body-1">
                    say hello —{" "}
                    <a href="mailto:founder@kreoon.com" className="text-primary">
                      FOUNDER@KREOON.COM
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
