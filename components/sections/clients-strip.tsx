import { Reveal } from "@/components/effects/reveal";

const proyectos = [
  { nombre: "KREOON", slogan: "Plataforma tech" },
  { nombre: "UGC Colombia", slogan: "Agencia creadores" },
  { nombre: "Infiny Group", slogan: "Holding digital" },
  { nombre: "Los Reyes del Contenido", slogan: "Comunidad" },
];

export function ClientsStrip() {
  return (
    <section
      aria-label="Ecosistema de marcas lideradas por Alexander Cast"
      className="relative border-y border-[color:var(--line)] bg-[color:var(--background)] py-10 md:py-14"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <p className="eyebrow text-center">Ecosistema · Marcas activas</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 md:grid-cols-4">
          {proyectos.map((p) => (
            <div
              key={p.nombre}
              className="group flex flex-col items-center gap-1 text-center opacity-60 transition-opacity hover:opacity-100"
            >
              <span className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
                {p.nombre}
              </span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                {p.slogan}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
