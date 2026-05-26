"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "ac-preloader-v2";

/** Splash inicial con logo dorado metalizado. */
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      setVisible(false);
      return;
    }
    const timeout = window.setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[color:var(--background)]"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <motion.span
                className="absolute -inset-10 -z-10 rounded-full bg-[color:var(--gold-mid)]/20 blur-3xl"
                animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <Image
                  src="/logos/ac-gold-mark.png"
                  alt=""
                  width={140}
                  height={87}
                  priority
                  className="h-24 w-auto drop-shadow-[0_10px_30px_rgba(212,175,55,0.45)]"
                />
              </motion.div>
            </div>
            <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg,#6b4f0e 0%,#d4af37 40%,#fff3c4 50%,#d4af37 60%,#8a6e18 100%)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.36em] text-white/50">
              Dios · Estrategia · IA
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
