import "server-only";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import type {
  ColumnaKanban,
  EstadisticasTablero,
  EstadoComercial,
  EstadoTarea,
  FiltrosTablero,
  ParticipacionSocio,
  Proyecto,
  ProyectoLink,
  ProyectoNota,
  ProyectoTarea,
  Sociedad,
  Socio,
  TipoLink,
} from "./types";

/**
 * Todo entra por service role: las tablas int_ tienen RLS prendido y sin
 * politicas, asi que solo el servidor las ve. El control de acceso lo hace
 * requireAuth mas los permisos por rol, no la base.
 */

export async function listarColumnas(): Promise<ColumnaKanban[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_kanban_columnas")
    .select("id, nombre, orden, color, es_inicial, es_final")
    .order("orden", { ascending: true });

  if (error) {
    console.error("[int-queries] listarColumnas:", error.message);
    return [];
  }

  return (data ?? []).map((c) => ({
    id: c.id as string,
    nombre: c.nombre as string,
    orden: c.orden as number,
    color: c.color as string,
    esInicial: c.es_inicial as boolean,
    esFinal: c.es_final as boolean,
  }));
}

export async function listarSociedades(): Promise<Sociedad[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_sociedades")
    .select("id, nombre, descripcion, activa")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[int-queries] listarSociedades:", error.message);
    return [];
  }

  return (data ?? []).map((s) => ({
    id: s.id as string,
    nombre: s.nombre as string,
    descripcion: s.descripcion as string | null,
    activa: s.activa as boolean,
  }));
}

export async function listarSocios(): Promise<Socio[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_socios")
    .select("id, nombre, email, admin_user_id, activo")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[int-queries] listarSocios:", error.message);
    return [];
  }

  return (data ?? []).map((s) => ({
    id: s.id as string,
    nombre: s.nombre as string,
    email: s.email as string | null,
    adminUserId: s.admin_user_id as string | null,
    activo: s.activo as boolean,
  }));
}

export async function listarParticipaciones(): Promise<ParticipacionSocio[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data: filas, error }, sociedades, socios] = await Promise.all([
    supabase
      .from("int_sociedad_socios")
      .select("sociedad_id, socio_id, pct_participacion, rol_notas"),
    listarSociedades(),
    listarSocios(),
  ]);

  if (error) {
    console.error("[int-queries] listarParticipaciones:", error.message);
    return [];
  }

  const nombreSociedad = new Map(sociedades.map((s) => [s.id, s.nombre]));
  const nombreSocio = new Map(socios.map((s) => [s.id, s.nombre]));

  return (filas ?? []).map((f) => ({
    sociedadId: f.sociedad_id as string,
    sociedadNombre: nombreSociedad.get(f.sociedad_id as string) ?? "—",
    socioId: f.socio_id as string,
    socioNombre: nombreSocio.get(f.socio_id as string) ?? "—",
    pct: Number(f.pct_participacion ?? 0),
    rolNotas: f.rol_notas as string | null,
  }));
}

/** Gente del panel que puede aparecer como responsable de un proyecto. */
export async function listarResponsables(): Promise<
  { id: string; nombre: string }[]
> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, email, role, is_active")
    .eq("is_active", true)
    .neq("role", "tester")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[int-queries] listarResponsables:", error.message);
    return [];
  }

  return (data ?? []).map((u) => ({
    id: u.id as string,
    nombre: (u.full_name as string | null) ?? (u.email as string),
  }));
}

export async function listarProyectos(
  filtros: FiltrosTablero = {},
): Promise<Proyecto[]> {
  const supabase = createSupabaseServiceRole();

  let consulta = supabase
    .from("int_proyectos")
    .select(
      "id, sociedad_id, nombre, cliente, responsable_id, estado_comercial, columna_id, orden, fecha_inicio, fecha_cierre_est, ppto_ingresos, ppto_gastos, notas, archivado",
    )
    .eq("archivado", false)
    .eq("es_operacion_general", false)
    .order("orden", { ascending: true });

  if (filtros.sociedadId) consulta = consulta.eq("sociedad_id", filtros.sociedadId);
  if (filtros.responsableId)
    consulta = consulta.eq("responsable_id", filtros.responsableId);
  if (filtros.estadoComercial)
    consulta = consulta.eq("estado_comercial", filtros.estadoComercial);

  const [{ data, error }, sociedades, responsables] = await Promise.all([
    consulta,
    listarSociedades(),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarProyectos:", error.message);
    return [];
  }

  return mapearProyectos(data ?? [], sociedades, responsables);
}

export async function obtenerProyecto(id: string): Promise<Proyecto | null> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, sociedades, responsables] = await Promise.all([
    supabase
      .from("int_proyectos")
      .select(
        "id, sociedad_id, nombre, cliente, responsable_id, estado_comercial, columna_id, orden, fecha_inicio, fecha_cierre_est, ppto_ingresos, ppto_gastos, notas, archivado",
      )
      .eq("id", id)
      .maybeSingle(),
    listarSociedades(),
    listarResponsables(),
  ]);

  if (error || !data) {
    if (error) console.error("[int-queries] obtenerProyecto:", error.message);
    return null;
  }

  return mapearProyectos([data], sociedades, responsables)[0] ?? null;
}

type FilaProyecto = Record<string, unknown>;

function mapearProyectos(
  filas: FilaProyecto[],
  sociedades: Sociedad[],
  responsables: { id: string; nombre: string }[],
): Proyecto[] {
  const nombreSociedad = new Map(sociedades.map((s) => [s.id, s.nombre]));
  const nombreResponsable = new Map(responsables.map((r) => [r.id, r.nombre]));

  return filas.map((p) => {
    const sociedadId = (p.sociedad_id as string | null) ?? null;
    const responsableId = (p.responsable_id as string | null) ?? null;

    return {
      id: p.id as string,
      nombre: p.nombre as string,
      cliente: (p.cliente as string | null) ?? null,
      sociedadId,
      sociedadNombre: sociedadId ? (nombreSociedad.get(sociedadId) ?? null) : null,
      responsableId,
      responsableNombre: responsableId
        ? (nombreResponsable.get(responsableId) ?? null)
        : null,
      estadoComercial: p.estado_comercial as EstadoComercial,
      columnaId: (p.columna_id as string | null) ?? null,
      orden: (p.orden as number | null) ?? 0,
      fechaInicio: (p.fecha_inicio as string | null) ?? null,
      fechaCierreEst: (p.fecha_cierre_est as string | null) ?? null,
      pptoIngresos:
        p.ppto_ingresos === null || p.ppto_ingresos === undefined
          ? null
          : Number(p.ppto_ingresos),
      pptoGastos:
        p.ppto_gastos === null || p.ppto_gastos === undefined
          ? null
          : Number(p.ppto_gastos),
      notas: (p.notas as string | null) ?? null,
      archivado: (p.archivado as boolean | null) ?? false,
    };
  });
}

export async function listarLinks(proyectoId: string): Promise<ProyectoLink[]> {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_links")
    .select("id, proyecto_id, tipo, label, url")
    .eq("proyecto_id", proyectoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[int-queries] listarLinks:", error.message);
    return [];
  }

  return (data ?? []).map((l) => ({
    id: l.id as string,
    proyectoId: l.proyecto_id as string,
    tipo: l.tipo as TipoLink,
    label: l.label as string,
    url: l.url as string,
  }));
}

export async function listarTareas(proyectoId: string): Promise<ProyectoTarea[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, responsables] = await Promise.all([
    supabase
      .from("int_proyecto_tareas")
      .select("id, proyecto_id, titulo, descripcion, estado, asignado_a, orden")
      .eq("proyecto_id", proyectoId)
      .order("orden", { ascending: true }),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarTareas:", error.message);
    return [];
  }

  const nombres = new Map(responsables.map((r) => [r.id, r.nombre]));

  return (data ?? []).map((t) => {
    const asignadoA = (t.asignado_a as string | null) ?? null;
    return {
      id: t.id as string,
      proyectoId: t.proyecto_id as string,
      titulo: t.titulo as string,
      descripcion: (t.descripcion as string | null) ?? null,
      estado: t.estado as EstadoTarea,
      asignadoA,
      asignadoNombre: asignadoA ? (nombres.get(asignadoA) ?? null) : null,
      orden: (t.orden as number | null) ?? 0,
    };
  });
}

export async function listarNotas(proyectoId: string): Promise<ProyectoNota[]> {
  const supabase = createSupabaseServiceRole();
  const [{ data, error }, responsables] = await Promise.all([
    supabase
      .from("int_proyecto_notas")
      .select("id, proyecto_id, autor_id, tipo, texto, resuelto, created_at")
      .eq("proyecto_id", proyectoId)
      .order("created_at", { ascending: false }),
    listarResponsables(),
  ]);

  if (error) {
    console.error("[int-queries] listarNotas:", error.message);
    return [];
  }

  const nombres = new Map(responsables.map((r) => [r.id, r.nombre]));

  return (data ?? []).map((n) => {
    const autorId = (n.autor_id as string | null) ?? null;
    return {
      id: n.id as string,
      proyectoId: n.proyecto_id as string,
      autorId,
      autorNombre: autorId ? (nombres.get(autorId) ?? null) : null,
      tipo: n.tipo as "bug" | "nota",
      texto: n.texto as string,
      resuelto: n.resuelto as boolean,
      createdAt: n.created_at as string,
    };
  });
}

/**
 * Metricas del tablero. Los conteos salen de los proyectos que ya se
 * cargaron; solo el ciclo necesita ir a la actividad.
 */
export async function calcularEstadisticas(
  proyectos: Proyecto[],
  columnas: ColumnaKanban[],
): Promise<EstadisticasTablero> {
  const columnaFinal = columnas.find((c) => c.esFinal);

  const porColumna = columnas.map((c) => ({
    columnaId: c.id,
    nombre: c.nombre,
    total: proyectos.filter((p) => p.columnaId === c.id).length,
  }));

  const conteoResponsable = new Map<string, number>();
  for (const p of proyectos) {
    if (!p.responsableNombre) continue;
    conteoResponsable.set(
      p.responsableNombre,
      (conteoResponsable.get(p.responsableNombre) ?? 0) + 1,
    );
  }

  const porResponsable = [...conteoResponsable.entries()]
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);

  const entregados = columnaFinal
    ? proyectos.filter((p) => p.columnaId === columnaFinal.id)
    : [];

  return {
    activos: proyectos.filter(
      (p) => !columnaFinal || p.columnaId !== columnaFinal.id,
    ).length,
    sinResponsable: proyectos.filter((p) => !p.responsableId).length,
    entregadosEsteMes: await contarEntregadosEsteMes(entregados.map((p) => p.id)),
    porColumna,
    porResponsable,
    diasPromedioCiclo: await calcularDiasPromedioCiclo(columnaFinal?.id ?? null),
  };
}

async function contarEntregadosEsteMes(idsEntregados: string[]): Promise<number> {
  if (idsEntregados.length === 0) return 0;

  const supabase = createSupabaseServiceRole();
  const inicioMes = new Date();
  inicioMes.setUTCDate(1);
  inicioMes.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("int_proyecto_actividad")
    .select("proyecto_id")
    .in("proyecto_id", idsEntregados)
    .eq("accion", "proyecto_movido")
    .gte("created_at", inicioMes.toISOString());

  if (error) {
    console.error("[int-queries] contarEntregadosEsteMes:", error.message);
    return 0;
  }

  return new Set((data ?? []).map((f) => f.proyecto_id as string)).size;
}

/**
 * Promedio de dias entre el nacimiento del proyecto y el movimiento que lo
 * dejo en la columna final. Si nadie llego nunca al final, devuelve null.
 */
async function calcularDiasPromedioCiclo(
  columnaFinalId: string | null,
): Promise<number | null> {
  if (!columnaFinalId) return null;

  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("int_proyecto_actividad")
    .select("proyecto_id, created_at, detalle")
    .eq("accion", "proyecto_movido")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("[int-queries] diasPromedioCiclo:", error.message);
    return null;
  }

  const llegadaAlFinal = new Map<string, string>();
  for (const fila of data) {
    const detalle = fila.detalle as { hacia?: string } | null;
    if (detalle?.hacia !== columnaFinalId) continue;
    llegadaAlFinal.set(fila.proyecto_id as string, fila.created_at as string);
  }

  if (llegadaAlFinal.size === 0) return null;

  const { data: proyectos, error: errorProyectos } = await supabase
    .from("int_proyectos")
    .select("id, created_at")
    .in("id", [...llegadaAlFinal.keys()]);

  if (errorProyectos || !proyectos) return null;

  const dias: number[] = [];
  for (const p of proyectos) {
    const fin = llegadaAlFinal.get(p.id as string);
    if (!fin) continue;
    const ms =
      new Date(fin).getTime() - new Date(p.created_at as string).getTime();
    if (ms >= 0) dias.push(ms / 86_400_000);
  }

  if (dias.length === 0) return null;

  return Math.round(dias.reduce((a, b) => a + b, 0) / dias.length);
}
