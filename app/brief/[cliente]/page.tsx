import type { Metadata } from 'next';
import { BriefForm } from '@/components/brief/BriefForm';
import { listaClientes, resolverCliente, seccionesPara } from '@/lib/brief/schema';

/**
 * Formulario de descubrimiento por cliente: /brief/<slug>.
 * El slug se resuelve contra la lista blanca del cuestionario; uno
 * desconocido cae en el cliente demo en vez de dar 404.
 */

interface Props {
  params: Promise<{ cliente: string }>;
}

export function generateStaticParams() {
  return listaClientes().map((cliente) => ({ cliente: cliente.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cliente: slug } = await params;
  const cliente = resolverCliente(slug);
  return {
    title: `Formulario de marca — ${cliente.marca}`,
    description: 'Cuestionario de descubrimiento para el desarrollo de tu tienda online.',
    robots: { index: false, follow: false },
  };
}

export default async function BriefClientePage({ params }: Props) {
  const { cliente: slug } = await params;
  const cliente = resolverCliente(slug);
  const secciones = seccionesPara(cliente.sector);

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-black"
              style={{ backgroundColor: cliente.acento }}
            >
              {cliente.marca.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{cliente.marca}</p>
              <p className="text-xs text-white/40">Formulario de descubrimiento</p>
            </div>
          </div>
          <p className="hidden text-xs text-white/35 sm:block">
            {secciones.length} secciones · ~20 minutos
          </p>
        </div>
      </header>

      <BriefForm
        slug={cliente.slug}
        marca={cliente.marca}
        acento={cliente.acento}
        secciones={secciones}
      />

      <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/30 lg:px-8">
        La información se usa únicamente para el desarrollo de tu proyecto.
      </footer>
    </main>
  );
}
