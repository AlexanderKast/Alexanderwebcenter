import { LlavesMcp, type LlaveMcp } from "@/components/mcp/LlavesMcp";
import { requireAuth } from "@/lib/auth";
import { urlDelSitio } from "@/lib/sitio";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const metadata = { title: "Conectar por MCP · Admin" };
export const dynamic = "force-dynamic";

/**
 * Como conectar el panel a Claude.
 *
 * La pantalla esta detras de requireAuth, igual que todo /admin: la llave se
 * saca desde adentro, con la sesion ya hecha. Y la llave que se crea aca es
 * de quien la creo — el MCP entra con su rol, no con uno prestado.
 */
export default async function McpPage() {
  const usuario = await requireAuth();

  const { data, error } = await createSupabaseServiceRole()
    .from("int_mcp_tokens")
    .select("id, nombre, pista, ultimo_uso_at, activo, created_at")
    .eq("admin_user_id", usuario.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[mcp] listar llaves:", error.message);

  const llaves: LlaveMcp[] = (data ?? []).map((f) => ({
    id: f.id as string,
    nombre: f.nombre as string,
    pista: f.pista as string,
    ultimoUsoAt: f.ultimo_uso_at as string | null,
    activo: f.activo as boolean,
    createdAt: f.created_at as string,
  }));

  const base = urlDelSitio();
  const urlMcp = `${base}/api/mcp`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Conectar por MCP</h1>
        <p className="max-w-2xl text-sm text-white/50">
          Deja usar el panel hablando con Claude: leer la bandeja de ideas,
          responderle a quien mandó una, mover un proyecto y dejar notas de en
          qué vamos. Todo lo que hagas queda firmado con tu nombre.
        </p>
      </header>

      <LlavesMcp llaves={llaves} urlMcp={urlMcp} />

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
          Qué puede hacer
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-white/55">
          <li>
            · Ideas: leer la bandeja, crear ideas y responderle al autor por Telegram.
          </li>
          <li>· Proyectos: ver el tablero, mover de columna y dejar notas.</li>
          <li>· Finanzas: consultar movimientos. Solo lectura.</li>
          <li>· Guiones: ver la biblioteca y crear borradores.</li>
        </ul>
        <p className="mt-4 text-xs text-white/35">
          Con tu rol de {usuario.role}. Lo que no podés hacer en el panel,
          tampoco lo podés hacer desde el chat.
        </p>
      </div>
    </div>
  );
}
