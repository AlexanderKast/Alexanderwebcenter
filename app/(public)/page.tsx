import { HomeHeader }  from "@/components/home/HomeHeader";
import { HomeHero }     from "@/components/home/HomeHero";
import { HomeStats }    from "@/components/home/HomeStats";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeProcess }  from "@/components/home/HomeProcess";
import { HomeFooter }   from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomeProcess />
      <HomeFooter />
    </>
  );
}
