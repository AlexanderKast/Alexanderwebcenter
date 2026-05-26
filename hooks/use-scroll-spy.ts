"use client";

import { useEffect, useState } from "react";

/**
 * Detecta qué sección `#id` está visible y retorna su id activo.
 * Solo considera anchors dentro de la misma página (#...).
 */
export function useScrollSpy(ids: string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}
