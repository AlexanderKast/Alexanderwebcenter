"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** FAB que aparece tras 400px y hace scroll suave al top. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="to-top"
          type="button"
          aria-label="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[55] grid size-12 place-items-center rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)] text-[color:var(--brand)] shadow-[0_12px_28px_-10px_rgba(254,197,68,0.6)] transition-colors hover:bg-[color:var(--gold-soft)]"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
