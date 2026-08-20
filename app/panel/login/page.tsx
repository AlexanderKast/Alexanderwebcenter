import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { usuarioPanel } from '@/lib/brief/panel-auth';
import Acceso from './Acceso';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Panel del formulario' },
  robots: { index: false, follow: false },
};

export default async function PaginaAcceso() {
  if (await usuarioPanel()) redirect('/panel');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6">
      <Acceso />
    </main>
  );
}
