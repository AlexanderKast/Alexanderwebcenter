import { HomePreloader }  from "@/components/home/HomePreloader";
import { HomeHero }       from "@/components/home/HomeHero";
import { HomeMarquee }    from "@/components/home/HomeMarquee";
import { HomeStats }      from "@/components/home/HomeStats";
import { HomeSobreMi }    from "@/components/home/HomeSobreMi";
import { HomeServices }   from "@/components/home/HomeServices";
import { HomeProcess }    from "@/components/home/HomeProcess";
import { HomeTestimonios } from "@/components/home/HomeTestimonios";
import { HomeRecursos }   from "@/components/home/HomeRecursos";
import { HomePodcast }    from "@/components/home/HomePodcast";
import { HomeContacto }   from "@/components/home/HomeContacto";

export default function HomePage() {
  return (
    <>
      <HomePreloader />
      <HomeHero />
      <HomeMarquee />
      <HomeStats />
      <HomeSobreMi />
      <HomeServices />
      <HomeProcess />
      <HomeTestimonios />
      <HomeRecursos />
      <HomePodcast />
      <HomeContacto />
    </>
  );
}
