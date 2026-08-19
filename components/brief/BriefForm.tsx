'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Save } from 'lucide-react';
import { calcularProgreso, camposVisibles, conMarca, esVisible, tieneValor } from '@/lib/brief/schema';
import type { BriefCampo, BriefRespuestas, BriefSeccion } from '@/types/brief';
import { CampoBrief } from './CampoBrief';

interface BriefFormProps {
  slug: string;
  marca: string;
  acento: string;
  secciones: BriefSeccion[];
}

type Estado = 'inactivo' | 'guardando' | 'enviando';

/** El borrador vive en localStorage: es un store externo, no estado de React. */
function suscribirAStorage(alCambiar: () => void): () => void {
  window.addEventListener('storage', alCambiar);
  return () => window.removeEventListener('storage', alCambiar);
}

/**
 * Lee el borrador guardado. En el servidor devuelve vacio, asi que el HTML
 * inicial trae el formulario limpio y React lo completa al hidratar, sin
 * pantalla de carga ni setState dentro de un efecto.
 */
function useBorrador(clave: string): { respuestas: BriefRespuestas; paso: number } {
  const crudo = useSyncExternalStore(
    suscribirAStorage,
    () => localStorage.getItem(clave),
    () => null,
  );
  const pasoCrudo = useSyncExternalStore(
    suscribirAStorage,
    () => localStorage.getItem(`${clave}:paso`),
    () => null,
  );

  return useMemo(() => {
    let respuestas: BriefRespuestas = {};
    try {
      if (crudo) respuestas = JSON.parse(crudo) as BriefRespuestas;
    } catch {
      respuestas = {}; // borrador corrupto: se empieza limpio
    }
    const paso = Number(pasoCrudo ?? '0');
    return { respuestas, paso: Number.isFinite(paso) && paso > 0 ? paso : 0 };
  }, [crudo, pasoCrudo]);
}

export function BriefForm({ slug, marca, acento, secciones }: BriefFormProps) {
  const router = useRouter();
  const claveBorrador = `brief:${slug}:v1`;

  const borrador = useBorrador(claveBorrador);
  const [editadas, setEditadas] = useState<BriefRespuestas | null>(null);
  const [pasoElegido, setPasoElegido] = useState<number | null>(null);
  const [estado, setEstado] = useState<Estado>('inactivo');
  const [aviso, setAviso] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [camposMal, setCamposMal] = useState<string[]>([]);
  const [insistio, setInsistio] = useState(false);
  const [trampa, setTrampa] = useState('');

  // Se marca al montar (no en render, que debe ser puro): sirve para
  // descartar envios instantaneos de bots.
  const abiertoEn = useRef<number | null>(null);
  const guardadoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    abiertoEn.current = Date.now();
  }, []);

  // Mientras nadie edite, mandan los valores del borrador.
  const respuestas = editadas ?? borrador.respuestas;
  const paso = Math.min(pasoElegido ?? borrador.paso, secciones.length);
  const hayCambios = editadas !== null || pasoElegido !== null;

  const totalPasos = secciones.length + 1; // +1 por la revision
  const esRevision = paso === secciones.length;
  const seccionActual = esRevision ? null : secciones[paso];

  /* ---------- guardado del borrador ---------- */
  useEffect(() => {
    if (!hayCambios) return;
    if (guardadoRef.current) clearTimeout(guardadoRef.current);
    guardadoRef.current = setTimeout(() => {
      try {
        localStorage.setItem(claveBorrador, JSON.stringify(respuestas));
        localStorage.setItem(`${claveBorrador}:paso`, String(paso));
      } catch {
        // sin espacio o modo privado: se sigue sin borrador
      }
      setEstado((actual) => (actual === 'guardando' ? 'inactivo' : actual));
    }, 500);
    return () => {
      if (guardadoRef.current) clearTimeout(guardadoRef.current);
    };
  }, [respuestas, paso, claveBorrador, hayCambios]);

  /* ---------- progreso ---------- */
  const progreso = useMemo(() => calcularProgreso(secciones, respuestas), [secciones, respuestas]);

  const progresoPorSeccion = useMemo(
    () =>
      secciones.map((seccion) => {
        const visibles = camposVisibles(seccion, respuestas);
        const llenos = visibles.filter((campo) => tieneValor(respuestas[campo.id])).length;
        return { llenos, total: visibles.length };
      }),
    [secciones, respuestas],
  );

  const actualizar = useCallback(
    (campo: BriefCampo, valor: string | string[]) => {
      setEditadas((prev) => ({ ...(prev ?? borrador.respuestas), [campo.id]: valor }));
      setCamposMal((prev) => prev.filter((id) => id !== campo.id));
      setEstado((actual) => (actual === 'enviando' ? actual : 'guardando'));
    },
    [borrador.respuestas],
  );

  /* ---------- navegacion ---------- */
  const irA = useCallback(
    (destino: number) => {
      setPasoElegido(Math.max(0, Math.min(secciones.length, destino)));
      setAviso('');
      setErrores([]);
      setInsistio(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [secciones.length],
  );

  const faltantes = useMemo(() => {
    if (!seccionActual) return [] as BriefCampo[];
    return camposVisibles(seccionActual, respuestas).filter(
      (campo) => campo.r && !tieneValor(respuestas[campo.id]),
    );
  }, [seccionActual, respuestas]);

  /* ---------- envio ---------- */
  const enviar = useCallback(async () => {
    const contacto = ['contacto_nombre', 'contacto_whatsapp'];
    if (contacto.some((id) => !tieneValor(respuestas[id]))) {
      irA(0);
      setAviso('Falta tu nombre y tu WhatsApp para poder responderte.');
      return;
    }
    if (progreso.pct < 60) {
      const seguir = window.confirm(`Vas en ${progreso.pct}% del formulario. ¿Querés enviarlo así?`);
      if (!seguir) return;
    }

    setEstado('enviando');
    setErrores([]);
    setAviso('');

    try {
      const res = await fetch('/api/brief/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: slug,
          sitioWeb: trampa,
          msEnPagina: abiertoEn.current === null ? 0 : Date.now() - abiertoEn.current,
          respuestas,
        }),
      });
      const datos = (await res.json()) as { ok?: boolean; error?: string; errores?: string[] };

      if (!res.ok || !datos.ok) {
        setEstado('inactivo');
        setErrores(datos.errores ?? []);
        setAviso(datos.error ?? 'No pudimos enviar el formulario.');
        return;
      }

      try {
        localStorage.removeItem(claveBorrador);
        localStorage.removeItem(`${claveBorrador}:paso`);
      } catch {
        // sin borrador que limpiar
      }
      router.push('/brief/gracias');
    } catch {
      setEstado('inactivo');
      setAviso('Se cayó la conexión. Tus respuestas siguen guardadas en este equipo: probá de nuevo.');
    }
  }, [respuestas, progreso.pct, slug, trampa, claveBorrador, router, irA]);

  function siguiente() {
    if (esRevision) {
      void enviar();
      return;
    }
    // El primer paso (datos de contacto) es bloqueante; en el resto se puede
    // avanzar insistiendo, para no perder un brief a medio llenar.
    const bloqueante = paso === 0;
    if (faltantes.length > 0 && (bloqueante || !insistio)) {
      setCamposMal(faltantes.map((campo) => campo.id));
      setInsistio(true);
      setAviso(
        bloqueante
          ? 'Necesitamos tus datos de contacto para poder responderte.'
          : `Faltan ${faltantes.length} respuestas necesarias. Tocá otra vez para continuar igual.`,
      );
      document
        .querySelector(`[data-campo="${faltantes[0].id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    irA(paso + 1);
  }

  // El formulario se pinta desde el servidor con el estado vacio; cuando el
  // efecto lee el borrador local, React vuelve a renderizar con los valores.
  // Asi el HTML inicial ya trae las preguntas (sin pantalla de carga).
  return (
    <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[260px_1fr] lg:px-8">
      {/* ---------- navegacion lateral ---------- */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Progreso</p>
          <p className="mt-2 text-3xl font-semibold" style={{ color: acento }}>
            {progreso.pct}%
          </p>
          <p className="text-xs text-white/40">
            {progreso.respondidas} de {progreso.total} respuestas
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progreso.pct}%`, backgroundColor: acento }}
            />
          </div>

          <nav className="mt-5 space-y-1" aria-label="Secciones del formulario">
            {secciones.map((seccion, i) => {
              const { llenos, total } = progresoPorSeccion[i];
              const completa = total > 0 && llenos === total;
              return (
                <button
                  key={seccion.n}
                  type="button"
                  onClick={() => irA(i)}
                  aria-current={i === paso ? 'step' : undefined}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    i === paso
                      ? 'bg-white/10 font-medium text-white'
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]"
                    style={{
                      borderColor: completa ? acento : 'rgba(255,255,255,.2)',
                      color: completa ? acento : 'inherit',
                    }}
                  >
                    {completa ? <Check className="h-3 w-3" aria-hidden /> : i}
                  </span>
                  <span className="flex-1 truncate">{conMarca(seccion.t, marca)}</span>
                  <span className="text-[11px] tabular-nums text-white/30">
                    {llenos}/{total}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => irA(secciones.length)}
              aria-current={esRevision ? 'step' : undefined}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                esRevision
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-[10px]">
                <Check className="h-3 w-3" aria-hidden />
              </span>
              Revisión y envío
            </button>
          </nav>

          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/30">
            <Save className="h-3 w-3" aria-hidden />
            {estado === 'guardando' ? 'Guardando…' : 'Se guarda en este equipo'}
          </p>
        </div>
      </aside>

      {/* ---------- contenido ---------- */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
          Paso {paso + 1} de {totalPasos}
        </p>

        {aviso && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-amber-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              {aviso}
              {errores.length > 0 && (
                <span className="mt-1 block text-amber-200/80">{errores.join(' ')}</span>
              )}
            </span>
          </p>
        )}

        {seccionActual ? (
          <section className="mt-4">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {conMarca(seccionActual.t, marca)}
            </h2>
            {seccionActual.note && <p className="mt-2 text-sm text-white/50">{seccionActual.note}</p>}
            {seccionActual.callout && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                  seccionActual.callout.tipo === 'warn'
                    ? 'border-amber-400/25 bg-amber-400/5 text-amber-100/90'
                    : 'border-white/10 bg-white/[0.03] text-white/70'
                }`}
                // El texto viene del cuestionario que mantenemos nosotros en
                // content/brief/schema.ts, nunca de datos de un visitante.
                dangerouslySetInnerHTML={{ __html: seccionActual.callout.txt }}
              />
            )}

            <div className="mt-7 space-y-7">
              {seccionActual.f.map((campo) =>
                esVisible(campo, respuestas) ? (
                  <CampoBrief
                    key={campo.id}
                    campo={campo}
                    marca={marca}
                    acento={acento}
                    valor={respuestas[campo.id]}
                    conError={camposMal.includes(campo.id)}
                    onChange={actualizar}
                  />
                ) : null,
              )}
            </div>
          </section>
        ) : (
          <RevisionBrief
            secciones={secciones}
            respuestas={respuestas}
            marca={marca}
            acento={acento}
            progreso={progreso}
            onEditar={irA}
          />
        )}

        {/* trampa anti-bots: fuera de pantalla, nunca la ve una persona */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
        >
          <label htmlFor="sitioWeb">No llenar</label>
          <input
            id="sitioWeb"
            name="sitioWeb"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trampa}
            onChange={(e) => setTrampa(e.target.value)}
          />
        </div>

        {/* ---------- barra de acciones ---------- */}
        <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => irA(paso - 1)}
            disabled={paso === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Atrás
          </button>

          <button
            type="button"
            onClick={siguiente}
            disabled={estado === 'enviando'}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            style={{ backgroundColor: acento }}
          >
            {estado === 'enviando' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Enviando…
              </>
            ) : (
              <>
                {esRevision ? 'Enviar respuestas' : 'Siguiente'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Paso final: revision de todo lo respondido
   ============================================================ */

interface RevisionProps {
  secciones: BriefSeccion[];
  respuestas: BriefRespuestas;
  marca: string;
  acento: string;
  progreso: { pct: number; respondidas: number; total: number; faltanNecesarias: number };
  onEditar: (paso: number) => void;
}

function RevisionBrief({ secciones, respuestas, marca, acento, progreso, onEditar }: RevisionProps) {
  const completo = progreso.faltanNecesarias === 0;

  return (
    <section className="mt-4">
      <h2 className="text-2xl font-semibold text-white md:text-3xl">Revisión y envío</h2>
      <p className="mt-2 text-sm text-white/50">
        Revisá lo que vas a enviar. Podés volver a cualquier sección para completarla.
      </p>

      <div
        className="mt-5 rounded-xl border px-4 py-3 text-sm"
        style={{
          borderColor: completo ? `${acento}55` : 'rgba(251,191,36,.25)',
          backgroundColor: completo ? `${acento}0f` : 'rgba(251,191,36,.05)',
          color: completo ? acento : '#fde68a',
        }}
      >
        <strong>{progreso.pct}% completado</strong> — {progreso.respondidas} de {progreso.total}{' '}
        respuestas.{' '}
        {completo
          ? 'No falta ninguna respuesta necesaria.'
          : `Faltan ${progreso.faltanNecesarias} respuestas necesarias.`}
      </div>

      <div className="mt-6 space-y-3">
        {secciones.map((seccion, i) => {
          const visibles = camposVisibles(seccion, respuestas);
          const llenos = visibles.filter((campo) => tieneValor(respuestas[campo.id])).length;
          const seccionCompleta = visibles.length > 0 && llenos === visibles.length;
          return (
            <details key={seccion.n} className="rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm text-white/80">
                <span className="text-xs tabular-nums text-white/35">{seccion.n}</span>
                <span className="flex-1">{conMarca(seccion.t, marca)}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] tabular-nums"
                  style={{
                    backgroundColor: seccionCompleta ? `${acento}1a` : 'rgba(255,255,255,.06)',
                    color: seccionCompleta ? acento : 'rgba(255,255,255,.5)',
                  }}
                >
                  {llenos}/{visibles.length}
                </span>
              </summary>
              <div className="space-y-3 border-t border-white/10 px-4 py-4">
                {visibles.map((campo) => {
                  const valor = respuestas[campo.id];
                  const texto = Array.isArray(valor) ? valor.join(' · ') : (valor ?? '');
                  return (
                    <div key={campo.id}>
                      <p className="text-xs font-medium text-white/45">{conMarca(campo.l, marca)}</p>
                      <p
                        className={`mt-0.5 whitespace-pre-wrap text-sm ${
                          texto ? 'text-white/85' : 'italic text-white/30'
                        }`}
                      >
                        {texto || 'Sin responder'}
                      </p>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => onEditar(i)}
                  className="mt-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  Editar esta sección
                </button>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
