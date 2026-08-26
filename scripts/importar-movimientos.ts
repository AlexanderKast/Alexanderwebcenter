/**
 * Baja los gastos y cobros del Sheet financiero a la base.
 *
 * Idempotente: cada fila del Sheet tiene una huella, asi que correrlo dos
 * veces actualiza en lugar de duplicar.
 *
 *   npm run importar:movimientos
 *
 * Lo mismo se puede hacer desde el panel con el boton "Sincronizar gastos".
 */

import { createClient } from "@supabase/supabase-js";
import { sincronizarMovimientos } from "../lib/proyectos/sincronizar-movimientos";

function cliente() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Revisá .env.local",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function main() {
  console.log("Bajando la hoja de movimientos…");
  const resultado = await sincronizarMovimientos(cliente());

  console.log("\nListo:");
  console.log(`  movimientos leídos    ${resultado.leidos}`);
  console.log(`  guardados             ${resultado.guardados}`);

  if (resultado.sinProyecto.length > 0) {
    console.log(`\nSin proyecto en el tablero (${resultado.sinProyecto.length}):`);
    for (const nombre of resultado.sinProyecto) console.log(`  · ${nombre}`);
    console.log("  El gasto quedó guardado igual, pero no suma a ninguna tarjeta.");
  }

  if (resultado.avisos.length > 0) {
    console.log(`\nAvisos (${resultado.avisos.length}):`);
    for (const aviso of resultado.avisos) console.log(`  · ${aviso}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
