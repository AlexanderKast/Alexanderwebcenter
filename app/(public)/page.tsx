import { DaviesHero } from "@/components/davies/DaviesHero";
import { DaviesWork } from "@/components/davies/DaviesWork";
import { DaviesFeature } from "@/components/davies/DaviesFeature";
import { DaviesServices } from "@/components/davies/DaviesServices";
import { DaviesProcess } from "@/components/davies/DaviesProcess";
import { DaviesAbout } from "@/components/davies/DaviesAbout";
import { DaviesTechStack } from "@/components/davies/DaviesTechStack";
import { DaviesTestimonials } from "@/components/davies/DaviesTestimonials";
import { DaviesPricing } from "@/components/davies/DaviesPricing";
import { DaviesFaq } from "@/components/davies/DaviesFaq";
import { DaviesCta } from "@/components/davies/DaviesCta";

export default function HomePage() {
  return (
    <>
      <DaviesHero />
      <DaviesWork />
      <DaviesFeature />
      <DaviesServices />
      <DaviesProcess />
      <DaviesAbout />
      <DaviesTechStack />
      <DaviesTestimonials />
      <DaviesPricing />
      <DaviesFaq />
      <DaviesCta />
    </>
  );
}
