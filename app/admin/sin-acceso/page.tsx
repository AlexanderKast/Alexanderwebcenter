import Link from "next/link";
import type { Metadata } from "next";
import { ShieldX } from "lucide-react";

export const metadata: Metadata = {
  title: "Sin acceso",
  robots: { index: false, follow: false },
};

export default function SinAccesoPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--background)] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
          <ShieldX className="size-8" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-white">
          Sin acceso
        </h1>
        <p className="mt-3 text-sm text-white/65">
          Tu sesión es válida pero no tienes permisos en{" "}
          <span className="text-[color:var(--gold-mid)]">admin_users</span>.
          Contacta al founder para que te agregue al equipo.
        </p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <Link href="/admin/login" className="btn-gold-outline">
            Volver al login
          </Link>
          <Link href="/" className="text-xs text-white/50 hover:text-white">
            Ir al sitio público
          </Link>
        </div>
      </div>
    </main>
  );
}
