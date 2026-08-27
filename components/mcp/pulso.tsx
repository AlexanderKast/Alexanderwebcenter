"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Quien esta tocando que, ahora mismo.
 *
 * La primera version pintaba un cartel en una esquina. Estorbaba y ademas
 * no contestaba la pregunta: "algo se movio" no sirve si hay que buscar
 * cual. Asi que el aviso se fue de la esquina y ahora se pinta encima de la
 * tarjeta que se esta tocando, como en un documento compartido: la fila se
 * ilumina, dice quien la esta moviendo, y se ve moverse.
 *
 * Para que se vea moverse hace falta lo segundo: cuando termina una
 * escritura se refresca la pagina sola. Sin eso la tarjeta se ilumina donde
 * estaba y recien salta cuando alguien recarga.
 */

export interface ActividadMcp {
  id: string;
  quien: string;
  descripcion: string;
  recursoTipo: string;
  recursoId: string;
  estado: "trabajando" | "listo" | "error";
}

const Pulso = createContext<ActividadMcp[]>([]);

const CADA = 3000;

/**
 * Cuanto se muestra el "lo esta moviendo" antes de mover la tarjeta.
 *
 * Escribir tarda cuatro decimas y el poll pregunta cada tres segundos, asi
 * que en la practica la tarjeta ya esta movida cuando llega la noticia:
 * nunca se veria el aviso. Se anuncia primero, se mueve despues.
 */
const ANUNCIO = 1800;

export function PulsoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [actividad, setActividad] = useState<ActividadMcp[]>([]);
  // Lo que ya se anuncio. Sin esto cada vuelta del poll vuelve a anunciar lo
  // mismo y a pedirle los datos al servidor mientras el aviso siga vivo.
  const vistas = useRef(new Set<string>());
  const [anunciando, setAnunciando] = useState<string[]>([]);

  useEffect(() => {
    let vivo = true;
    let timer: number | undefined;

    async function mirar() {
      // Con la pestaña de fondo no hay nadie mirando.
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/mcp/actividad", { cache: "no-store" });
          if (!vivo) return;

          if (res.status === 401) return; // se cayo la sesion: dejar de preguntar
          if (res.ok) {
            const datos = (await res.json()) as { actividad: ActividadMcp[] };
            const lista = datos.actividad ?? [];
            setActividad(lista);

            lista
              .filter((a) => !vistas.current.has(a.id))
              .forEach((a) => {
                vistas.current.add(a.id);
                setAnunciando((actuales) => [...actuales, a.id]);

                window.setTimeout(() => {
                  setAnunciando((actuales) => actuales.filter((x) => x !== a.id));
                  router.refresh();
                }, ANUNCIO);
              });
          }
        } catch {
          // Un corte de red lo arregla el proximo intento.
        }
      }
      if (vivo) timer = window.setTimeout(mirar, CADA);
    }

    mirar();

    return () => {
      vivo = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [router]);

  // Mientras dura el anuncio la fila se muestra como "trabajando" aunque el
  // servidor ya la haya dado por terminada: lo que se esta contando es que
  // esta por moverse.
  const conAnuncio = actividad.map((a) =>
    anunciando.includes(a.id) ? { ...a, estado: "trabajando" as const } : a,
  );

  return <Pulso.Provider value={conAnuncio}>{children}</Pulso.Provider>;
}

/** Todo lo que el MCP esta tocando ahora mismo. */
export function useActividadMcp(): ActividadMcp[] {
  return useContext(Pulso);
}

/** Lo que se esta haciendo sobre una fila concreta, o null. */
export function useActividadDe(tipo: string, id: string): ActividadMcp | null {
  const actividad = useContext(Pulso);
  return (
    actividad.find((a) => a.recursoTipo === tipo && a.recursoId === id) ?? null
  );
}
