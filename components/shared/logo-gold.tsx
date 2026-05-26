import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo dorado metalizado. variant "mark" solo monograma, "full" con wordmark. */
export function LogoGold({
  variant = "mark",
  className,
  priority = false,
}: {
  variant?: "mark" | "full";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "mark" ? "/logos/ac-gold-mark.png" : "/logos/ac-gold.png";
  const dims = variant === "mark" ? { w: 800, h: 469 } : { w: 1600, h: 1109 };
  return (
    <Image
      src={src}
      alt="Alexander Cast"
      width={dims.w}
      height={dims.h}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
      draggable={false}
    />
  );
}
