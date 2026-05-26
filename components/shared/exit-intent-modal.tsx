"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { HeroFormCapture } from "@/components/forms/hero-form-capture";

const STORAGE_KEY = "ac-exit-intent-v1";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    // solo desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let shown = false;
    const onMouseOut = (e: MouseEvent) => {
      if (shown) return;
      if (e.clientY <= 10 && !e.relatedTarget) {
        shown = true;
        window.sessionStorage.setItem(STORAGE_KEY, "1");
        setOpen(true);
      }
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-label="Espera, no te vayas sin esto"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border-gold-metallic p-8"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={close}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-[color:var(--line)] text-white/60 transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>

            <p className="eyebrow flex items-center gap-2">
              <Download className="size-3.5" /> Antes de irte
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Llévate los <span className="text-gold-shimmer">10 prompts</span> gratis.
            </h3>
            <p className="mt-2 text-sm text-white/65">
              Los mismos prompts que uso cada semana con Claude y ChatGPT.
              PDF 14 páginas. Descarga inmediata.
            </p>

            <div className="mt-6">
              <HeroFormCapture slug="10-prompts-ia-estrategas" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
