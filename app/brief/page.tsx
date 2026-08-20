import type { Metadata } from 'next';
import { BriefForm } from '@/components/brief/BriefForm';
import { resolverCliente, seccionesPara } from '@/lib/brief/schema';

export const metadata: Metadata = {
  // absolute: sin el sufijo de marca del layout raiz.
  title: { absolute: 'Formulario de proyecto' },
  description: 'Cuestionario de descubrimiento para arrancar el desarrollo.',
  robots: { index: false, follow: false },
};

/**
 * /brief entra directo al formulario, sin portada ni eleccion de marca:
 * quien llega ya sabe a que viene. Las versiones con marca propia siguen
 * en /brief/<slug>.
 */
export default function BriefPage() {
  const cliente = resolverCliente('demo');
  const secciones = seccionesPara(cliente.sector);

  return (
    <main className="relative z-10 min-h-screen pt-[92px] text-white">
      <BriefForm
        slug={cliente.slug}
        marca={cliente.marca}
        acento={cliente.acento}
        secciones={secciones}
      />
    </main>
  );
}
