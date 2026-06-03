import { Metadata } from 'next';
import { PortalLoginForm } from './PortalLoginForm';

export const metadata: Metadata = {
  title: 'Acceso al portal · Alexander Cast',
  robots: { index: false },
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            Portal exclusivo
          </span>
          <h1 className="text-2xl font-bold text-white">Accede a tu tablero</h1>
          <p className="text-sm text-white/40 mt-2">
            Ingresa con las credenciales que te compartió Alexander.
          </p>
        </div>
        <PortalLoginForm />
      </div>
    </div>
  );
}
