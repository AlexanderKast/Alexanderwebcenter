'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { TypeSelector } from '@/components/clientes/TypeSelector';
import { IdentitySection } from '@/components/clientes/IdentitySection';
import { AudienceSection } from '@/components/clientes/AudienceSection';
import { ValueSection } from '@/components/clientes/ValueSection';
import { VoiceSection } from '@/components/clientes/VoiceSection';
import { PillarsSection } from '@/components/clientes/PillarsSection';
import { PhilosophySection } from '@/components/clientes/PhilosophySection';
import { ObjectivesSection } from '@/components/clientes/ObjectivesSection';
import { ContextSection } from '@/components/clientes/ContextSection';
import { BrandType } from '@/types/clientes/brand';

const TOTAL_STEPS = 8;

const STEPS = [
  { label: 'Tipo',       subtitle: '¿Qué estructuraremos?' },
  { label: 'Identidad',  subtitle: 'Quién eres y qué haces' },
  { label: 'Audiencia',  subtitle: 'Para quién es tu marca' },
  { label: 'Valor',      subtitle: 'Qué ofreces y prometes' },
  { label: 'Voz',        subtitle: 'Cómo te comunicas' },
  { label: 'Pilares',    subtitle: 'Temas de contenido' },
  { label: 'Filosofía',  subtitle: 'Creencias y propósito' },
  { label: 'Objetivos',  subtitle: 'Metas y métricas' },
  { label: 'Contexto',   subtitle: 'Info adicional' },
];

const STEP_TIMES = [2, 4, 4, 3, 5, 3, 4, 3, 2];

interface FormState {
  tipo: BrandType;
  nombreMarca: string;
  expertiseDiferenciador: string;
  anosExperiencia: number;
  ubicacionGeografica: string;
  idiomas: string[];
  industriaNicho: string;
  perfilDemografico: string;
  problemaPrincipal: string;
  resultadoDeseado: string;
  nivelSofisticacion: number;
  objecionesPrincipales: string[];
  competenciaDirecta: string[];
  ventajaCompetitiva: string;
  queOfrece: string;
  promesaRealista: string;
  precioInversion: string;
  formatoEntrega: string;
  garantia: string;
  noPromete: string;
  estiloComuncacional: string;
  expresionesNaturales: string[];
  prohibiciones: string[];
  nivelFormalidad: number;
  usoHumor: string;
  regionalismos: string;
  temasSensibles: string;
  pilares: Array<{ nombre: string; porcentaje: number }>;
  creenciasFundamentales: string[];
  queRechaza: string[];
  limitesEticos: string[];
  propositoMarca: string;
  historiaOrigen: string;
  historiaBatallas: string;
  historiaLogros: string;
  mensajeCentral: string;
  comoPierciben: string;
  costoNoActuar: string;
  errorPrincipal: string;
  aQuienNoAyudo: string;
  resultadosClientes: string;
  figurasReferencia: { heroInfluencer: string; competidoresDirectos: string[]; creadoresIndustria: string[] };
  objetivoPrincipal: 'awareness' | 'leads' | 'ventas' | 'comunidad';
  kpiCritico: string;
  frecuenciaContenido: string;
  plataformas: string[];
  tiempoPorSemana: number;
  presupuesto: string;
  equipo: string;
  timeline: string;
  productosSecundarios: string[];
  colaboraciones: string[];
  temporadasEventos: string[];
  restricciones: string[];
  integracionesNecesarias: string[];
}

const DEFAULT_STATE: FormState = {
  tipo: 'personal',
  nombreMarca: '',
  expertiseDiferenciador: '',
  anosExperiencia: 1,
  ubicacionGeografica: '',
  idiomas: [],
  industriaNicho: '',
  perfilDemografico: '',
  problemaPrincipal: '',
  resultadoDeseado: '',
  nivelSofisticacion: 2,
  objecionesPrincipales: [],
  competenciaDirecta: [],
  ventajaCompetitiva: '',
  queOfrece: '',
  promesaRealista: '',
  precioInversion: '',
  formatoEntrega: '',
  garantia: '',
  noPromete: '',
  estiloComuncacional: '',
  expresionesNaturales: [],
  prohibiciones: [],
  nivelFormalidad: 5,
  usoHumor: 'Moderado',
  regionalismos: '',
  temasSensibles: '',
  pilares: [],
  creenciasFundamentales: [],
  queRechaza: [],
  limitesEticos: [],
  propositoMarca: '',
  historiaOrigen: '',
  historiaBatallas: '',
  historiaLogros: '',
  mensajeCentral: '',
  comoPierciben: '',
  costoNoActuar: '',
  errorPrincipal: '',
  aQuienNoAyudo: '',
  resultadosClientes: '',
  figurasReferencia: { heroInfluencer: '', competidoresDirectos: [], creadoresIndustria: [] },
  objetivoPrincipal: 'awareness',
  kpiCritico: '',
  frecuenciaContenido: '',
  plataformas: [],
  tiempoPorSemana: 10,
  presupuesto: '',
  equipo: '',
  timeline: '',
  productosSecundarios: [],
  colaboraciones: [],
  temporadasEventos: [],
  restricciones: [],
  integracionesNecesarias: [],
};

function validateStep(step: number, data: FormState): string[] {
  const errors: string[] = [];

  if (step === 1) {
    if (!data.nombreMarca || data.nombreMarca.length < 2) errors.push('Nombre de marca requerido');
    if (!data.industriaNicho || data.industriaNicho.length < 3) errors.push('Industria/nicho requerido');
    if (!data.expertiseDiferenciador || data.expertiseDiferenciador.length < 10) errors.push('Expertise requerido (mínimo 10 caracteres)');
    if (!data.ubicacionGeografica || data.ubicacionGeografica.length < 3) errors.push('Ubicación requerida');
    if (data.idiomas.length === 0) errors.push('Agrega al menos un idioma');
  } else if (step === 2) {
    if (!data.perfilDemografico || data.perfilDemografico.length < 20) errors.push('Perfil demográfico requerido (mínimo 20 caracteres)');
    if (!data.problemaPrincipal || data.problemaPrincipal.length < 20) errors.push('Problema principal requerido');
    if (!data.resultadoDeseado || data.resultadoDeseado.length < 20) errors.push('Resultado deseado requerido');
    if (data.objecionesPrincipales.length < 3) errors.push('Mínimo 3 objeciones principales');
    if (data.competenciaDirecta.length < 1) errors.push('Agrega al menos un competidor');
    if (!data.ventajaCompetitiva || data.ventajaCompetitiva.length < 20) errors.push('Ventaja competitiva requerida');
    if (!data.costoNoActuar || data.costoNoActuar.length < 20) errors.push('Describe el costo de no actuar');
    if (!data.errorPrincipal || data.errorPrincipal.length < 20) errors.push('Describe el error principal del cliente');
    if (!data.aQuienNoAyudo || data.aQuienNoAyudo.length < 10) errors.push('Define a quién no puedes ayudar');
  } else if (step === 3) {
    if (!data.queOfrece || data.queOfrece.length < 20) errors.push('Descripción de oferta requerida');
    if (!data.promesaRealista || data.promesaRealista.length < 20) errors.push('Promesa realista requerida');
    if (!data.precioInversion || data.precioInversion.length < 5) errors.push('Precio/inversión requerido');
    if (!data.formatoEntrega || data.formatoEntrega.length < 10) errors.push('Formato de entrega requerido');
    if (!data.noPromete || data.noPromete.length < 10) errors.push('Indica qué no prometes');
  } else if (step === 4) {
    if (!data.estiloComuncacional || data.estiloComuncacional.length < 10) errors.push('Estilo comunicacional requerido');
    if (data.expresionesNaturales.length < 15) errors.push(`Necesitas ${15 - data.expresionesNaturales.length} expresiones naturales más`);
    if (data.prohibiciones.length < 10) errors.push(`Necesitas ${10 - data.prohibiciones.length} prohibiciones más`);
    if (!data.usoHumor) errors.push('Selecciona el nivel de humor');
  } else if (step === 5) {
    if (!data.mensajeCentral || data.mensajeCentral.length < 20) errors.push('El mensaje central es requerido (mínimo 20 caracteres)');
    if (data.pilares.length < 3) errors.push('Necesitas mínimo 3 pilares');
    const total = data.pilares.reduce((s, p) => s + p.porcentaje, 0);
    if (total !== 100) errors.push(`Los pilares suman ${total}%, deben sumar exactamente 100%`);
  } else if (step === 6) {
    if (!data.propositoMarca || data.propositoMarca.length < 30) errors.push('Propósito de marca requerido (mínimo 30 caracteres)');
    if (data.creenciasFundamentales.length < 3) errors.push('Mínimo 3 creencias fundamentales');
    if (data.queRechaza.length < 2) errors.push('Mínimo 2 elementos que rechaza');
    if (data.limitesEticos.length < 2) errors.push('Mínimo 2 límites éticos');
  } else if (step === 7) {
    if (!data.kpiCritico || data.kpiCritico.length < 5) errors.push('KPI crítico requerido');
    if (!data.frecuenciaContenido || data.frecuenciaContenido.length < 5) errors.push('Frecuencia de contenido requerida');
    if (data.plataformas.length === 0) errors.push('Selecciona al menos una plataforma');
    if (!data.timeline || data.timeline.length < 5) errors.push('Timeline requerido');
  }

  return errors;
}

function FormContent() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('brand-intake-completed');
      if (saved) return JSON.parse(saved) as number[];
    } catch {}
    return [];
  });
  const [formData, setFormData] = useState<FormState>(() => {
    try {
      const saved = localStorage.getItem('brand-intake-form');
      if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_STATE;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem('brand-intake-form', JSON.stringify(formData));
    setLastSaved(new Date());
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('brand-intake-completed', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const update = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  }, []);

  const handleNext = () => {
    const errs = validateStep(step, formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setCompletedSteps((prev) => prev.includes(step) ? prev : [...prev, step]);
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setErrors([]);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (idx: number) => {
    if (completedSteps.includes(idx) || idx === 0 || completedSteps.includes(idx - 1)) {
      setDirection(idx > step ? 1 : -1);
      setErrors([]);
      setStep(idx);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      ...formData,
      garantia: formData.garantia || undefined,
      regionalismos: formData.regionalismos || undefined,
      temasSensibles: formData.temasSensibles || undefined,
      historiaOrigen: formData.historiaOrigen || undefined,
      presupuesto: formData.presupuesto || undefined,
      equipo: formData.equipo || undefined,
      recursosDisponibles: {
        tiempoPorSemana: formData.tiempoPorSemana,
        presupuesto: formData.presupuesto || undefined,
        equipo: formData.equipo || undefined,
      },
    };

    try {
      const res = await fetch('/api/clientes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('submit_result', JSON.stringify(data));
        localStorage.removeItem('brand-intake-form');
        localStorage.removeItem('brand-intake-completed');
        router.push('/clientes/gracias');
      } else {
        setSubmitError(data.error || 'Error al enviar. Intenta de nuevo.');
      }
    } catch {
      setSubmitError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((step + 1) / (TOTAL_STEPS + 1)) * 100;
  const isLastStep = step === TOTAL_STEPS;
  const remainingTime = STEP_TIMES.slice(step).reduce((a, b) => a + b, 0);
  const timeStr = lastSaved
    ? lastSaved.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER FIJO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 md:px-8 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/logos/ac-gold.png"
                alt="Alexander Cast"
                width={120}
                height={40}
                style={{ width: '90px', height: 'auto' }}
                priority
              />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white leading-none">Brand Architect</p>
                <p className="text-xs text-gray-500">Sistema de Marca</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {STEPS.map((s, i) => {
                const done = completedSteps.includes(i);
                const active = i === step;
                const accessible = i === 0 || done || completedSteps.includes(i - 1);
                return (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    disabled={!accessible}
                    aria-label={s.label}
                    className={`
                      rounded-full transition-all duration-300 flex-shrink-0
                      ${active ? 'w-6 h-2.5 bg-yellow-400' : ''}
                      ${!active && done ? 'w-2.5 h-2.5 bg-yellow-600' : ''}
                      ${!active && !done ? 'w-2.5 h-2.5 bg-gray-700' : ''}
                      ${accessible && !active ? 'hover:bg-yellow-500/60 cursor-pointer' : ''}
                      ${!accessible ? 'cursor-not-allowed opacity-40' : ''}
                    `}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm font-bold text-yellow-400 hidden sm:block">
                {Math.round(progress)}%
              </span>
              {timeStr && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {timeStr}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-2">
            <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="pt-24 pb-28 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                {step + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                Paso {step + 1} de {TOTAL_STEPS + 1}
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                · ~{remainingTime} min restantes
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {STEPS[step].label}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">{STEPS[step].subtitle}</p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="step-card"
            >
              {step === 0 && <TypeSelector value={formData.tipo} onChange={(v) => update('tipo', v)} />}
              {step === 1 && (
                <IdentitySection
                  tipo={formData.tipo} nombreMarca={formData.nombreMarca}
                  expertiseDiferenciador={formData.expertiseDiferenciador}
                  anosExperiencia={formData.anosExperiencia}
                  ubicacionGeografica={formData.ubicacionGeografica}
                  idiomas={formData.idiomas} industriaNicho={formData.industriaNicho}
                  comoPierciben={formData.comoPierciben} onUpdate={update}
                />
              )}
              {step === 2 && (
                <AudienceSection
                  perfilDemografico={formData.perfilDemografico}
                  problemaPrincipal={formData.problemaPrincipal}
                  resultadoDeseado={formData.resultadoDeseado}
                  nivelSofisticacion={formData.nivelSofisticacion}
                  objecionesPrincipales={formData.objecionesPrincipales}
                  competenciaDirecta={formData.competenciaDirecta}
                  ventajaCompetitiva={formData.ventajaCompetitiva}
                  costoNoActuar={formData.costoNoActuar}
                  errorPrincipal={formData.errorPrincipal}
                  aQuienNoAyudo={formData.aQuienNoAyudo} onUpdate={update}
                />
              )}
              {step === 3 && (
                <ValueSection
                  queOfrece={formData.queOfrece} promesaRealista={formData.promesaRealista}
                  precioInversion={formData.precioInversion} formatoEntrega={formData.formatoEntrega}
                  garantia={formData.garantia} noPromete={formData.noPromete}
                  resultadosClientes={formData.resultadosClientes} onUpdate={update}
                />
              )}
              {step === 4 && (
                <VoiceSection
                  estiloComuncacional={formData.estiloComuncacional}
                  expresionesNaturales={formData.expresionesNaturales}
                  prohibiciones={formData.prohibiciones}
                  nivelFormalidad={formData.nivelFormalidad}
                  usoHumor={formData.usoHumor} regionalismos={formData.regionalismos}
                  temasSensibles={formData.temasSensibles} onUpdate={update}
                />
              )}
              {step === 5 && (
                <PillarsSection
                  pilares={formData.pilares} mensajeCentral={formData.mensajeCentral} onUpdate={update}
                />
              )}
              {step === 6 && (
                <PhilosophySection
                  creenciasFundamentales={formData.creenciasFundamentales}
                  queRechaza={formData.queRechaza} limitesEticos={formData.limitesEticos}
                  propositoMarca={formData.propositoMarca} historiaOrigen={formData.historiaOrigen}
                  historiaBatallas={formData.historiaBatallas} historiaLogros={formData.historiaLogros}
                  onUpdate={update}
                />
              )}
              {step === 7 && (
                <ObjectivesSection
                  objetivoPrincipal={formData.objetivoPrincipal} kpiCritico={formData.kpiCritico}
                  frecuenciaContenido={formData.frecuenciaContenido} plataformas={formData.plataformas}
                  tiempoPorSemana={formData.tiempoPorSemana} presupuesto={formData.presupuesto}
                  equipo={formData.equipo} timeline={formData.timeline} onUpdate={update}
                />
              )}
              {step === 8 && (
                <ContextSection
                  productosSecundarios={formData.productosSecundarios}
                  colaboraciones={formData.colaboraciones}
                  temporadasEventos={formData.temporadasEventos}
                  restricciones={formData.restricciones}
                  integracionesNecesarias={formData.integracionesNecesarias}
                  figurasReferencia={formData.figurasReferencia} onUpdate={update}
                />
              )}

              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <p className="text-sm font-semibold text-red-400 mb-2">
                    Corrige estos campos antes de continuar:
                  </p>
                  <ul className="space-y-1">
                    {errors.map((e, i) => (
                      <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                        <span className="mt-0.5 flex-shrink-0 text-red-500">•</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {submitError && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-300">{submitError}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER FIJO */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800">
        <div className="px-4 md:px-8 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button" onClick={handlePrev} disabled={step === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-700 text-gray-300 bg-transparent hover:bg-gray-800 hover:border-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="text-center">
              <p className="text-xs font-medium text-white">{STEPS[step].label}</p>
              <p className="text-xs text-gray-600">{step + 1} / {TOTAL_STEPS + 1}</p>
            </div>

            {!isLastStep ? (
              <button
                type="button" onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-300 active:bg-yellow-500 transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(251,191,36,0.3)]"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button" onClick={handleSubmit} disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(251,191,36,0.3)]"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Generando...</span></>
                ) : (
                  <><span>Enviar y generar</span><CheckCircle2 className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando...</span>
          </div>
        </div>
      }
    >
      <FormContent />
    </Suspense>
  );
}
