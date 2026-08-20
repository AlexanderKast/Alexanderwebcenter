import { HomeChromeEstilos } from '@/components/home/HomeChromeEstilos';
import { HomeVideoBackground } from '@/components/home/HomeVideoBackground';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeFooter } from '@/components/home/HomeFooter';

/**
 * El formulario usa el mismo chrome que el resto del sitio: fondo, menu
 * de secciones y pie. Entrar al brief no debe sentirse como salir de la
 * plataforma.
 */
export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeChromeEstilos />
      <HomeVideoBackground />
      <HomeHeader />
      {children}
      <HomeFooter />
    </>
  );
}
