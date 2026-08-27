import type { Metadata } from "next";
import type { ReactNode } from "react";
import { menuDelPanel } from "@/lib/admin/menu";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { PulsoProvider } from "@/components/mcp/pulso";
import { Toaster } from "@/components/ui/sonner";

/**
 * El menu se arma en cada pedido: si el layout se cachea, apagar una
 * entrada desde la configuracion no se ve hasta el proximo deploy.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Alexander Cast",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const secciones = user ? await menuDelPanel(user) : [];

  const panel = (
    <div className="min-h-screen bg-[color:var(--background)]">
      {user ? (
        <div className="flex min-h-screen">
          <AdminSidebar user={user} secciones={secciones} />
          {/* min-w-0: sin esto la columna no puede achicarse por debajo del
              ancho de su contenido, el tablero la estira y el que termina
              scrolleando de lado es toda la pagina, con el sidebar adentro. */}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader user={user} secciones={secciones} />
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

  // El pulso envuelve todo el panel: cualquier pantalla puede preguntar si
  // el MCP le esta tocando una fila, y hay un solo poll para todas.
  return user ? <PulsoProvider>{panel}</PulsoProvider> : panel;
}
