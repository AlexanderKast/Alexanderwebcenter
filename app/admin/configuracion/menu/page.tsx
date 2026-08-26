import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConfiguradorMenu } from "@/components/admin/ConfiguradorMenu";
import { catalogoDelMenu, seccionesConocidas } from "@/lib/admin/menu";
import { requireAuth } from "@/lib/auth";
import { puedeGestionarConfiguracion } from "@/lib/proyectos/permisos";

export const metadata = { title: "Menú del panel · Admin" };
export const dynamic = "force-dynamic";

export default async function MenuDelPanelPage() {
  const usuario = await requireAuth();
  if (!puedeGestionarConfiguracion(usuario.role)) redirect("/admin");

  const items = await catalogoDelMenu(usuario);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/configuracion"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a configuración
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Menú del panel</h1>
        <p className="max-w-2xl text-sm text-white/50">
          Apagá lo que no uses, renombrá lo que quieras, movelo de lugar o agregá
          tus propios accesos. Apagar una entrada no borra la pantalla: sale del
          menú y vuelve cuando la prendas.
        </p>
      </header>

      <ConfiguradorMenu items={items} secciones={seccionesConocidas(items)} />
    </div>
  );
}
