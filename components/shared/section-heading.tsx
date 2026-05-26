import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  superlabel?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  superlabel,
  title,
  description,
  align = "center",
  className,
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
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-white/60 md:text-lg leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
