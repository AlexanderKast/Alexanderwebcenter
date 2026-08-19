import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  superlabel?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /**
   * Nivel del encabezado. Por defecto h2, porque el componente se usa
   * sobre todo en secciones interiores. Cuando encabeza la pagina hay que
   * pasar "h1": si no, la pagina queda sin h1, lo que rompe la jerarquia
   * para buscadores y lectores de pantalla.
   */
  as?: "h1" | "h2";
};

export function SectionHeading({
  superlabel,
  title,
  description,
  align = "center",
  className,
  as: Titulo = "h2",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "mx-auto text-center items-center"
      : "text-left items-start";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 max-w-3xl",
        alignment,
        className,
      )}
    >
      {superlabel ? (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          {superlabel}
        </span>
      ) : null}
      <Titulo className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </Titulo>
      {description ? (
        <p className="text-base text-white/60 md:text-lg leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
