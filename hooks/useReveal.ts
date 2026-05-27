"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Detecta cuando un elemento entra al viewport.
 * Una vez visible, desconecta el observer (one-shot).
 */
export function useReveal<T extends Element = HTMLDivElement>(
  threshold = 0.12
) {
  const ref     = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}
