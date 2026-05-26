"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const events = [
  { name: "María G.", action: "descargó los 10 Prompts IA" },
  { name: "Carlos R.", action: "agendó una consultoría" },
  { name: "Lucía P.", action: "se unió a la newsletter" },
  { name: "Jairo M.", action: "descargó El Sistema DEI" },
  { name: "Ana D.",    action: "descargó los 10 Prompts IA" },
  { name: "Felipe O.", action: "agendó una consultoría" },
];

export function FloatingSocialProof() {
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    // Primer pop tras 8s, luego rota cada 14s
    const first = window.setTimeout(() => setIdx(0), 8000);
    const loop = window.setInterval(() => {
      setIdx((i) => (i + 1) % events.length);
    }, 14000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);

  const ev = idx >= 0 ? events[idx] : null;

  return (
    <AnimatePresence mode="wait">
      {ev ? (
        <motion.div
          key={idx}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-24 left-4 z-[47] hidden max-w-xs md:block"
        >
          <div className="card-dark rounded-xl border border-[color:var(--gold-mid)]/25 bg-[color:var(--surface-1)]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--gold-mid)]" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold text-white">{ev.name}</p>
                <p className="text-white/60">{ev.action}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/35">
                  hace {Math.floor(Math.random() * 9) + 1} min
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
