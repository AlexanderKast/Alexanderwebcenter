"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, CalendarCheck } from "lucide-react";

/** Barra fija inferior (solo móvil) con los 2 CTAs principales. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="sticky"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-[48] flex items-center gap-2 border-t border-[color:var(--line)] bg-[color:var(--background)]/95 px-3 py-3 backdrop-blur-xl md:hidden"
        >
          <Link
            href="/#recurso"
            className="btn-gold-metallic h-11 flex-1 min-w-0 px-3 text-xs"
          >
            <Download className="size-4" aria-hidden />
            Descargar
          </Link>
          <Link
            href="/consultoria"
            className="btn-gold-outline h-11 flex-1 min-w-0 px-3 text-xs"
          >
            <CalendarCheck className="size-4" aria-hidden />
            Agendar
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
