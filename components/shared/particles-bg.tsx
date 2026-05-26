"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

/**
 * Replica del particles.js de Davis Portfolio 1:
 * 355 partículas blancas, sin líneas conectadas, movimiento random,
 * bubble al hover y push al click.
 */
export function ParticlesBg({ id = "hero-particles" }: { id?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 200, density: { enable: true } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: { enable: true, speed: 0.6, sync: false },
        },
        size: {
          value: { min: 1, max: 2 },
          animation: { enable: true, speed: 4, sync: false },
        },
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.25,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          bubble: { distance: 100, size: 3, duration: 2, opacity: 1, speed: 3 },
          push: { quantity: 4 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!ready) return null;

  return (
    <Particles
      id={id}
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
