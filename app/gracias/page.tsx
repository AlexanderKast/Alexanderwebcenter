import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { THANK_YOU_COPY } from "@/lib/constants";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: `Gracias | ${site.name}`,
  description: "Gracias por tu interes en el ecosistema de Alexander Cast.",
  path: "/gracias",
  noindex: true,
});

type SearchParams = Promise<{ t?: string }>;

type ThankYouKey = keyof typeof THANK_YOU_COPY;

function resolveCopy(t: string | undefined): (typeof THANK_YOU_COPY)[ThankYouKey] {
  if (t && t in THANK_YOU_COPY) {
    return THANK_YOU_COPY[t as ThankYouKey];
  }
  return {
    titulo: "Gracias.",
    mensaje: "Tu solicitud fue recibida correctamente.",
  };
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { t } = await searchParams;
  const copy = resolveCopy(t);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#E6B800]">
        {site.tagline}
      </p>
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{copy.titulo}</h1>
      <p className="mb-10 text-lg text-neutral-300">{copy.mensaje}</p>
      <Link
        href="/"
        className="rounded-lg border border-[#E6B800] px-6 py-3 text-sm font-semibold text-[#E6B800] transition hover:bg-[#E6B800] hover:text-black"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
