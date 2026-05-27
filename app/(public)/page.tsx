import { HomePreloader }      from "@/components/home/HomePreloader";
import { HomeCursor }         from "@/components/home/HomeCursor";
import { HomeVideoBackground } from "@/components/home/HomeVideoBackground";
import { HomeHeader }          from "@/components/home/HomeHeader";
import { HomeHero }            from "@/components/home/HomeHero";
import { HomeMarquee }         from "@/components/home/HomeMarquee";
import { HomeStats }           from "@/components/home/HomeStats";
import { HomeServices }        from "@/components/home/HomeServices";
import { HomeProcess }         from "@/components/home/HomeProcess";
import { HomeFooter }          from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <>
      {/* Experiencia de carga premium */}
      <HomePreloader />

      {/* Cursor personalizado (solo desktop) */}
      <HomeCursor />

      {/* Video de fondo fijo — z-index:-1, scrubbing por scroll */}
      <HomeVideoBackground />

      {/* Contenido */}
      <HomeHeader />
      <HomeHero />
      <HomeMarquee />
      <HomeStats />
      <HomeServices />
      <HomeProcess />
      <HomeFooter />
    </>
  );
}
