import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { listarEnvios } from "@/lib/brief/consultas";

export const metadata = { title: "Briefs de marca · Admin" };
export const dynamic = "force-dynamic";

function fecha(valor: string): string {
  const d = new Date(valor);
  return Number.isNaN(d.getTime())
    ? valor
    : d.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      });
}

export default async function BriefsPage() {
  await requireAuth();
  const envios = await listarEnvios();

  const sinLeer = envios.filter((e) => e.estado === "nuevo").length;
  const promedio =
    envios.length === 0
      ? 0
      : Math.round(envios.reduce((s, e) => s + e.completadoPct, 0) / envios.length);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Briefs de marca</h1>
        <p className="text-sm text-white/50">
          Lo que responde cada cliente en el formulario de{" "}
          <Link href="/brief" className="underline underline-offset-4 hover:text-white">
            /brief
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-3xl font-semibold text-white">{envios.length}</p>
          <p className="text-xs text-white/40">formularios recibidos</p>
        </div>
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">
          <p className="text-3xl font-semibold text-[#D4AF37]">{sinLeer}</p>
          <p className="text-xs text-white/40">sin leer</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-5">
          <p className="text-3xl font-semibold text-white">{promedio}%</p>
          <p className="text-xs text-white/40">completado promedio</p>
        </div>
      </div>

      {envios.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-10 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-white/20" />
          <p className="mt-3 text-sm text-white/60">Todavía no llegó ningún formulario.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[color:var(--line)]">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="bg-white/[0.03] text-left text-[11px] uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Completado</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Recibido</th>
              </tr>
            </thead>
            <tbody>
              {envios.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/briefs/${e.id}`}
                      className="font-medium text-white underline-offset-4 hover:underline"
                    >
                      {e.contactoNombre || "Sin nombre"}
                    </Link>
                    <div className="text-xs text-white/40">
                      {e.contactoEmail || e.contactoTel || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {e.marca}
                    <div className="text-xs text-white/40">{e.empresa || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full bg-[#D4AF37]"
                          style={{ width: `${e.completadoPct}%` }}
                        />
                      </span>
                      <span className="text-xs text-white/50">
                        {e.completadoPct}% · {e.respondidas}/{e.totalCampos}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/60">{e.estado}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{fecha(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
