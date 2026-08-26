import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin · Alexander Cast",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {user ? (
        <div className="flex min-h-screen">
          <AdminSidebar user={user} />
          {/* min-w-0: sin esto la columna no puede achicarse por debajo del
              ancho de su contenido, el tablero la estira y el que termina
              scrolleando de lado es toda la pagina, con el sidebar adentro. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader user={user} />
            <main className="min-w-0 flex-1 bg-[color:var(--surface-0)] p-6 md:p-10">{children}</main>
          </div>
        </div>
      ) : (
        <main className="min-h-screen">{children}</main>
      )}
      {/* Sin esto los toast.error/success del panel no se ven: sonner
          necesita su Toaster montado en el arbol. */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
